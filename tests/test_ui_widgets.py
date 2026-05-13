"""UI widget tests — pure-Qt, no service state, no hardware."""
from PyQt6.QtCore import Qt


def test_radial_gauge_value(qtbot, qapp):
    from polylux.ui.widgets.gauge import RadialGauge
    g = RadialGauge(label="CPU", unit="°C")
    qtbot.addWidget(g)
    g.set_value(53.0)
    assert g.value() == 53.0
    assert g.label() == "CPU"


def test_radial_gauge_threshold_color(qtbot, qapp):
    from polylux.ui.widgets.gauge import RadialGauge, COOL, WARM, HOT
    g = RadialGauge(label="CPU", unit="°C", thresholds=(60.0, 80.0))
    qtbot.addWidget(g)
    g.set_value(30.0)
    assert g.arc_color() == COOL
    g.set_value(70.0)
    assert g.arc_color() == WARM
    g.set_value(90.0)
    assert g.arc_color() == HOT


def test_radial_gauge_clamps_below_min(qtbot, qapp):
    from polylux.ui.widgets.gauge import RadialGauge
    g = RadialGauge(label="X", unit="", min_value=0, max_value=100)
    qtbot.addWidget(g)
    g.set_value(-10.0)
    assert g.value() == 0
    g.set_value(150.0)
    assert g.value() == 100
