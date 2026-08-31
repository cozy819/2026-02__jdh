from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd


OUTPUT = Path(__file__).parent / "output"
OUTPUT.mkdir(exist_ok=True)

days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
visitors = [18, 25, 21, 32, 29]

fig, ax = plt.subplots(figsize=(8, 4.5))
bars = ax.bar(
    days,
    visitors,
    color=["#72757d", "#72757d", "#72757d", "#ff5a00", "#72757d"],
)
ax.set_ylim(0, 36)
ax.set_title("Visitors by Day")
ax.set_xlabel("Day")
ax.set_ylabel("Visitors (people)")
ax.bar_label(bars)
fig.tight_layout()
fig.savefig(OUTPUT / "04-1_visitors_bar.png", dpi=160)
plt.close(fig)

df = pd.DataFrame({"day": days, "visitors": visitors})
ax = df.plot(
    x="day",
    y="visitors",
    kind="bar",
    legend=False,
    color="#158790",
    figsize=(8, 4.5),
)
ax.set_ylim(0, 36)
ax.set_title("Visitors by Day")
ax.set_xlabel("Day")
ax.set_ylabel("Visitors (people)")
ax.bar_label(ax.containers[0])
plt.tight_layout()
plt.savefig(OUTPUT / "04-2_dataframe_bar.png", dpi=160)
plt.close()
