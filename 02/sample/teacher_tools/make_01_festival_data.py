"""2-1 흥미 유도용 가상 축제 방문 기록 100,000건을 만든다.

학생 실습용 파일이 아니라, 교사가 예시 화면을 다시 만들 때 사용하는 제작 도구다.
"""

from __future__ import annotations

import csv
import random
from datetime import datetime, timedelta
from pathlib import Path


ROW_COUNT = 100_000
RANDOM_SEED = 20260830

BOOTHS = [
    ("떡볶이 가게", "음식", 3_000, 0.25, 8),
    ("슬러시 카페", "음식", 2_000, 0.18, 5),
    ("방탈출 게임", "게임", 1_000, 0.17, 12),
    ("다트 챌린지", "게임", 1_000, 0.15, 4),
    ("캘리그라피 체험", "체험", 1_500, 0.11, 3),
    ("사진 부스", "체험", 2_000, 0.14, 6),
]
TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
TIME_WEIGHTS = [0.06, 0.10, 0.18, 0.22, 0.19, 0.15, 0.10]
CONGESTION = {"10:00": 0.65, "11:00": 0.85, "12:00": 1.20, "13:00": 1.45,
              "14:00": 1.25, "15:00": 1.00, "16:00": 0.75}


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def main() -> None:
    random.seed(RANDOM_SEED)
    project_root = Path(__file__).resolve().parents[1]
    output_path = project_root / "data" / "01_festival_booth_activity.csv"
    start = datetime(2026, 9, 18, 10, 0)

    fieldnames = [
        "visit_id", "visited_at", "time_slot", "booth", "category",
        "grade", "spent_won", "wait_min", "satisfaction",
    ]
    booth_weights = [item[3] for item in BOOTHS]

    with output_path.open("w", newline="", encoding="utf-8-sig") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()

        for index in range(1, ROW_COUNT + 1):
            time_slot = random.choices(TIME_SLOTS, weights=TIME_WEIGHTS, k=1)[0]
            booth, category, price, _weight, base_wait = random.choices(
                BOOTHS, weights=booth_weights, k=1
            )[0]
            hour = int(time_slot[:2])
            minute = random.randrange(0, 60)
            visited_at = start.replace(hour=hour, minute=0) + timedelta(minutes=minute)

            wait = max(0, round(random.gauss(base_wait * CONGESTION[time_slot], 2.2)))
            satisfaction = round(clamp(5.0 - wait * 0.055 + random.gauss(0, 0.28), 2.5, 5.0), 1)
            purchased = random.random() < (0.87 if category == "음식" else 0.72)

            writer.writerow(
                {
                    "visit_id": f"V{index:06d}",
                    "visited_at": visited_at.strftime("%Y-%m-%d %H:%M:%S"),
                    "time_slot": time_slot,
                    "booth": booth,
                    "category": category,
                    "grade": random.choices([1, 2, 3], weights=[0.36, 0.34, 0.30], k=1)[0],
                    "spent_won": price if purchased else 0,
                    "wait_min": wait,
                    "satisfaction": satisfaction,
                }
            )

    print(f"{output_path.relative_to(project_root)}: {ROW_COUNT:,}행 생성 완료")


if __name__ == "__main__":
    main()
