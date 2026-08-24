#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
교과서 HTML 의 번역 단위를 뽑아내고(extract) 중국어를 되넣는다(apply).

번역 단위 = '잎 요소'
  · 안에 블록 요소(div/p/ul/table/…)나 코드(pre)가 없고
  · 한글이 하나라도 들어 있고
  · 아직 <span class="ko"> 로 감싸이지 않은 요소

사용법
  python3 i18n.py extract 03-1.html            → 번호|한국어 목록
  python3 i18n.py apply 03-1.html trans.txt    → 번호|중국어 를 읽어 되넣기
"""
import sys, io, re
from html.parser import HTMLParser

VOID = {'br', 'img', 'hr', 'meta', 'link', 'input', 'source'}
# 이 태그 안의 글을 번역 대상으로 본다
TARGET = {'p', 'li', 'dd', 'dt', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5',
          'summary', 'figcaption', 'div', 'span', 'b', 'em', 'strong'}
# 안에 이런 태그가 있으면 잎 요소가 아니다
BLOCKISH = re.compile(
    r'<\s*(div|p|ul|ol|li|table|tr|td|th|dl|dt|dd|section|figure|details|'
    r'summary|pre|h1|h2|h3|h4|h5|img|nav|main|figcaption)\b', re.I)
HANGUL = re.compile(r'[가-힣]')
BADGE = re.compile(r'\s*<span class="badge [^"]*">[^<]*</span>\s*$')


class Scan(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.stack = []
        self.leaves = []   # (tag, inner_start, inner_end, open_end)

    def handle_starttag(self, tag, attrs):
        if tag in VOID:
            return
        self.stack.append((tag, self.getpos(), self.rawdata_offset_end()))

    def rawdata_offset_end(self):
        # 현재 시작태그가 끝나는 문자 오프셋
        return self.offset_of(self.getpos()) + len(self.get_starttag_text() or '')

    def offset_of(self, pos):
        line, col = pos
        return self.line_offsets[line - 1] + col

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                _, spos, inner_start = self.stack[i]
                inner_end = self.offset_of(self.getpos())
                del self.stack[i:]
                if tag in TARGET:
                    self.leaves.append((tag, inner_start, inner_end))
                return


def scan(src):
    p = Scan()
    offs, n = [0], 0
    for line in src.splitlines(keepends=True):
        n += len(line)
        offs.append(n)
    p.line_offsets = offs
    p.feed(src)
    return p.leaves


def units(src):
    """번역 단위 목록: [(start, end, inner_html)] — 문서 순서, 겹치지 않음"""
    out = []
    for tag, s, e in scan(src):
        inner = src[s:e]
        if not HANGUL.search(inner):
            continue
        if 'class="ko"' in inner or 'class="zh"' in inner:
            continue
        if BLOCKISH.search(inner):
            continue
        out.append((s, e, inner))
    out.sort(key=lambda x: (x[0], -x[1]))
    # 겹치는 것(중첩 잎)은 바깥쪽만 남긴다
    keep, last = [], -1
    for s, e, inner in out:
        if s >= last:
            keep.append((s, e, inner))
            last = e
    return keep


def cmd_extract(path):
    src = io.open(path, encoding='utf-8').read()
    for i, (s, e, inner) in enumerate(units(src), 1):
        one = ' '.join(inner.split())
        print('%d|%s' % (i, one))


def cmd_apply(path, transpath):
    src = io.open(path, encoding='utf-8').read()
    tr = {}
    for line in io.open(transpath, encoding='utf-8'):
        line = line.rstrip('\n')
        if not line.strip() or '|' not in line:
            continue
        k, v = line.split('|', 1)
        if k.strip().isdigit():
            tr[int(k.strip())] = v
    us = units(src)
    miss = []
    for i, (s, e, inner) in enumerate(reversed(us), 1):
        idx = len(us) - i + 1
        zh = tr.get(idx)
        if zh is None:
            miss.append(idx)
            continue
        ko = inner
        tail = ''
        m = BADGE.search(ko)
        if m:                      # 깊이 배지는 언어와 무관하므로 밖에 둔다
            tail = m.group(0)
            ko = ko[:m.start()]
        src = (src[:s] + '<span class="ko">' + ko.strip() + '</span>'
               + '<span class="zh">' + zh.strip() + '</span>' + tail + src[e:])
    io.open(path, 'w', encoding='utf-8').write(src)
    print('applied %d / %d' % (len(us) - len(miss), len(us)))
    if miss:
        print('missing:', ' '.join(map(str, sorted(miss))))


if __name__ == '__main__':
    if sys.argv[1] == 'extract':
        cmd_extract(sys.argv[2])
    else:
        cmd_apply(sys.argv[2], sys.argv[3])
