import csv
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
CSV_PATH = ROOT / "05/sample/data/05-data-1-school-facility-usage.csv"
OUTPUT_DIR = ROOT / "assets/img"
REGULAR = "/Users/gojiwoong/Library/Fonts/IBMPlexSansKR-Regular.ttf"
BOLD = "/Users/gojiwoong/Library/Fonts/IBMPlexSansKR-Bold.ttf"
INK, ORANGE, TEAL = "#1B1D21", "#FF5C00", "#0B8995"
GREY, LINE, MUTED, WHITE = "#F1F2F4", "#E0E3E7", "#69707A", "#FFFFFF"
WD_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri"]
WD = dict(zip(WD_ORDER, "월화수목금"))
FAC = {"Gym": "체육관", "Computer_Room": "컴퓨터실", "Library": "도서관", "Music_Room": "음악실", "Science_Lab": "과학실", "Art_Room": "미술실"}


def f(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REGULAR, size)


def canvas(title, subtitle):
    im = Image.new("RGB", (1600, 900), WHITE)
    d = ImageDraw.Draw(im)
    d.text((90, 55), title, font=f(48, True), fill=INK)
    d.text((90, 122), subtitle, font=f(26), fill=MUTED)
    d.line((90, 172, 1510, 172), fill=LINE, width=3)
    return im, d


def center(d, x, y, text, ft, fill=INK):
    box = d.textbbox((0, 0), text, font=ft)
    d.text((x - (box[2] - box[0]) / 2, y - (box[3] - box[1]) / 2), text, font=ft, fill=fill)


def save(im, name):
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUTPUT_DIR / name
    im.save(out, optimize=True)
    print(out)


def rows():
    with CSV_PATH.open(encoding="utf-8-sig", newline="") as fp:
        data = list(csv.DictReader(fp))
    assert len(data) == 12960
    return data


def means(data, key):
    sums, counts, order = defaultdict(int), defaultdict(int), []
    for row in data:
        value = row[key]
        if value not in sums:
            order.append(value)
        sums[value] += int(row["visitors"])
        counts[value] += 1
    return order, {x: sums[x] / counts[x] for x in order}


def time_chart(data):
    order, values = means(data, "time_slot")
    im, d = canvas("시간대별 평균 이용 인원", "하루 동안 이용 인원이 어떻게 달라지는지 본다")
    l, t, r, b, ymax = 150, 230, 1500, 760, 36
    for tick in range(0, ymax + 1, 6):
        y = b - tick / ymax * (b - t)
        d.line((l, y, r, y), fill=LINE, width=2)
        d.text((92, y - 14), str(tick), font=f(20), fill=MUTED)
    pts = []
    for i, item in enumerate(order):
        x = l + i * (r - l) / (len(order) - 1)
        y = b - values[item] / ymax * (b - t)
        pts.append((x, y))
        center(d, x, b + 40, item, f(19), MUTED)
    d.line(pts, fill=INK, width=7, joint="curve")
    for x, y in pts:
        d.ellipse((x - 8, y - 8, x + 8, y + 8), fill=INK)
    maximum = max(values.values())
    peaks = [i for i, item in enumerate(order) if values[item] == maximum]
    for peak in peaks:
        x, y = pts[peak]
        d.ellipse((x - 17, y - 17, x + 17, y + 17), fill=ORANGE)
    x = (pts[peaks[0]][0] + pts[peaks[-1]][0]) / 2
    y = pts[peaks[0]][1]
    d.line((x, y - 22, x, y - 72), fill=ORANGE, width=4)
    d.text((x - 170, y - 115), f"가장 붐비는 구간  {order[peaks[0]]}–{order[peaks[-1]]}", font=f(24, True), fill=ORANGE)
    d.multiline_text((38, 445), "평균\n이용 인원\n(명)", font=f(20), fill=MUTED, spacing=5)
    save(im, "05-2-02-time-slot-average.png")


def share_chart(data):
    totals = defaultdict(int)
    for row in data:
        totals[row["facility"]] += int(row["visitors"])
    ordered = sorted(totals.items(), key=lambda x: x[1], reverse=True)
    overall = sum(totals.values())
    colors = [ORANGE, INK, TEAL, "#5E666F", "#8A9198", "#B8BDC3"]
    im, d = canvas("장소별 이용 인원 비율", "전체 이용에서 각 장소가 차지하는 몽을 본다")
    cx, cy, rad, start = 570, 510, 270, -90
    box = (cx - rad, cy - rad, cx + rad, cy + rad)
    for (_, value), color in zip(ordered, colors):
        end = start + value / overall * 360
        d.pieslice(box, start=start, end=end, fill=color, outline=WHITE, width=5)
        start = end
    inner = 155
    d.ellipse((cx - inner, cy - inner, cx + inner, cy + inner), fill=WHITE)
    center(d, cx, cy - 23, "전체", f(26), MUTED)
    center(d, cx, cy + 28, f"{overall:,}명", f(40, True))
    for i, ((name, value), color) in enumerate(zip(ordered, colors)):
        y, x = 275 + i * 78, 960
        d.rounded_rectangle((x, y, x + 28, y + 28), radius=5, fill=color)
        d.text((x + 48, y - 2), FAC[name], font=f(26, i == 0), fill=ORANGE if i == 0 else INK)
        d.text((x + 295, y - 2), f"{value / overall * 100:.1f}%", font=f(26, True), fill=ORANGE if i == 0 else INK)
    save(im, "05-2-03-facility-share.png")


def weekday_chart(data):
    _, values = means(data, "weekday")
    im, d = canvas("요일별 평균 이용 인원", "금요일의 반복되는 차이가 한눈에 드러난다")
    l, t, r, b, ymax = 190, 235, 1490, 760, 32
    for tick in range(0, ymax + 1, 8):
        y = b - tick / ymax * (b - t)
        d.line((l, y, r, y), fill=LINE, width=2)
        d.text((128, y - 14), str(tick), font=f(20), fill=MUTED)
    slot = (r - l) / len(WD_ORDER)
    for i, day in enumerate(WD_ORDER):
        value = values[day]
        x1, x2 = l + slot * i + 54, l + slot * (i + 1) - 54
        y = b - value / ymax * (b - t)
        color = ORANGE if day == "Fri" else INK
        d.rounded_rectangle((x1, y, x2, b), radius=8, fill=color)
        center(d, (x1 + x2) / 2, y - 30, f"{value:.1f}", f(25, True), color)
        center(d, (x1 + x2) / 2, b + 45, WD[day], f(25), MUTED)
    d.multiline_text((38, 445), "평균\n이용 인원\n(명)", font=f(20), fill=MUTED, spacing=5)
    save(im, "05-2-04-weekday-average.png")


def heatmap(data):
    time_order, _ = means(data, "time_slot")
    sums, counts = defaultdict(int), defaultdict(int)
    for row in data:
        key = row["weekday"], row["time_slot"]
        sums[key] += int(row["visitors"])
        counts[key] += 1
    values = {k: sums[k] / counts[k] for k in sums}
    im, d = canvas("요일과 시간대를 함께 본 이용 패턴", "두 기준을 겹쳐 보면 금요일 점심 무렵이 가장 붐빈다")
    l, t, r, b = 170, 245, 1500, 690
    cw, ch = (r - l) / len(time_order), (b - t) / len(WD_ORDER)
    palette = [GREY, "#C7E1E3", "#6CB5BC", ORANGE]
    for ri, day in enumerate(WD_ORDER):
        center(d, 115, t + ch * (ri + 0.5), WD[day], f(24, True))
        for ci, time in enumerate(time_order):
            value = values[(day, time)]
            level = 0 if value < 20 else 1 if value < 24 else 2 if value < 29 else 3
            x1, y1 = l + ci * cw + 3, t + ri * ch + 3
            x2, y2 = l + (ci + 1) * cw - 3, t + (ri + 1) * ch - 3
            d.rounded_rectangle((x1, y1, x2, y2), radius=7, fill=palette[level])
            center(d, (x1 + x2) / 2, (y1 + y2) / 2, f"{value:.0f}", f(21, True), WHITE if level >= 2 else INK)
    for ci, time in enumerate(time_order):
        center(d, l + cw * (ci + 0.5), b + 42, time, f(18), MUTED)
    for i, (label, color) in enumerate(zip(["20명 미만", "20–23명", "24–28명", "29명 이상"], palette)):
        x, y = 360 + i * 260, 790
        d.rounded_rectangle((x, y, x + 28, y + 28), radius=5, fill=color)
        d.text((x + 42, y - 2), label, font=f(20), fill=INK)
    save(im, "05-2-05-weekday-time-heatmap.png")


if __name__ == "__main__":
    data = rows()
    time_chart(data)
    share_chart(data)
    weekday_chart(data)
    heatmap(data)
