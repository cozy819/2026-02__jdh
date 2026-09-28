from pathlib import Path
import json
import tempfile
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "sample" / "data" / "05-data-1-school-facility-usage.csv"
NOTEBOOK_PATH = ROOT / "sample" / "notebooks" / "05_assessment1.ipynb"

df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")
expected_columns = ["date", "weekday", "time_slot", "facility", "visitors"]
assert list(df.columns) == expected_columns
assert len(df) == 12_960
assert df.isna().sum().sum() == 0
assert df["facility"].nunique() == 6
assert df["date"].nunique() == 180
assert df["time_slot"].nunique() == 12
assert df["visitors"].ge(0).all()

totals = df.groupby("facility", sort=False)["visitors"].sum().sort_values(ascending=False)
assert len(totals) == 6
assert totals.index[0] == "Gym"

# 수행평가 자료로 그래프를 실제로 만들 수 있는지 확인한다.
ax = totals.sort_values().plot(kind="barh", color="#FF5C00", figsize=(8, 4.5))
ax.set_title("Total Facility Visitors")
ax.set_xlabel("Visitors (people)")
ax.set_ylabel("Facility")
figure_path = Path(tempfile.gettempdir()) / "week05-assessment-reference.png"
plt.tight_layout()
plt.savefig(figure_path, dpi=140)
plt.close()
assert figure_path.exists() and figure_path.stat().st_size > 10_000

notebook = json.loads(NOTEBOOK_PATH.read_text(encoding="utf-8"))
assert notebook["nbformat"] == 4
assert len(notebook["cells"]) == 6
assert sum(c["cell_type"] == "code" for c in notebook["cells"]) == 1
assert all(not c.get("outputs") for c in notebook["cells"] if c["cell_type"] == "code")

print("CSV validation: PASS")
print(f"rows={len(df):,}, columns={len(df.columns)}, missing=0")
print(f"date={df['date'].min()}..{df['date'].max()}")
print("facility totals:")
print(totals.to_string())
print(f"reference graph: PASS ({figure_path})")
print("notebook validation: PASS")
