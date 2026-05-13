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


def test_scene_card_click_emits_signal(qtbot, qapp):
    from polylux.ui.widgets.scene_card import SceneCard
    c = SceneCard(scene_key="clock", title="CLOCK")
    qtbot.addWidget(c)
    with qtbot.waitSignal(c.clicked_scene, timeout=500) as blocker:
        qtbot.mouseClick(c, Qt.MouseButton.LeftButton)
    assert blocker.args == ["clock"]


def test_scene_card_active_property(qtbot, qapp):
    from polylux.ui.widgets.scene_card import SceneCard
    c = SceneCard(scene_key="text", title="TEXT")
    qtbot.addWidget(c)
    assert c.is_active() is False
    c.set_active(True)
    assert c.is_active() is True
    assert c.property("active") == "true"


def test_slider_row_emits_value_changed(qtbot, qapp):
    from polylux.ui.widgets.slider_row import SliderRow
    s = SliderRow(label="BRIGHTNESS", minimum=0, maximum=100, value=50)
    qtbot.addWidget(s)
    with qtbot.waitSignal(s.value_changed, timeout=500) as blocker:
        s.set_value(75)
    assert blocker.args == [75]
    assert s.value() == 75


def test_slider_row_value_label_updates(qtbot, qapp):
    from polylux.ui.widgets.slider_row import SliderRow
    s = SliderRow(label="X", minimum=0, maximum=100, value=10, fmt="{v}")
    qtbot.addWidget(s)
    s.set_value(42)
    assert "42" in s.value_label_text()


def test_seg_button_active_state(qtbot, qapp):
    from polylux.ui.widgets.seg_button import SegButton
    b = SegButton(options=[("0°", 0), ("90°", 90), ("180°", 180), ("270°", 270)],
                  value=270)
    qtbot.addWidget(b)
    assert b.value() == 270


def test_seg_button_click_changes_value(qtbot, qapp):
    from polylux.ui.widgets.seg_button import SegButton
    b = SegButton(options=[("A", "a"), ("B", "b")], value="a")
    qtbot.addWidget(b)
    with qtbot.waitSignal(b.value_changed, timeout=500) as blocker:
        b.set_value("b")
    assert blocker.args == ["b"]
    assert b.value() == "b"


def test_color_picker_set_color_updates_hex(qtbot, qapp):
    from polylux.ui.widgets.color_picker import ColorPicker
    c = ColorPicker(color=(193, 95, 60))
    qtbot.addWidget(c)
    assert c.hex_text() == "#C15F3C"
    c.set_color((0, 255, 0))
    assert c.hex_text() == "#00FF00"


def test_color_picker_preset_emits_signal(qtbot, qapp):
    from polylux.ui.widgets.color_picker import ColorPicker
    c = ColorPicker(color=(0, 0, 0), presets=[(255, 0, 0), (0, 255, 0)])
    qtbot.addWidget(c)
    with qtbot.waitSignal(c.color_changed, timeout=500) as blocker:
        c._on_preset_clicked(0)
    assert blocker.args == [(255, 0, 0)]


def test_matrix_preview_paints_without_error(qtbot, qapp):
    from polylux.ui.widgets.live_preview import MatrixLivePreview
    w = MatrixLivePreview()
    qtbot.addWidget(w)
    w.set_frame(b"\x00" * 1216)
    assert w.last_frame() == b"\x00" * 1216


def test_oled_preview_renders_text_frame(qtbot, qapp):
    from polylux.ui.widgets.live_preview import OledLivePreview
    w = OledLivePreview()
    qtbot.addWidget(w)
    w.set_frame(("text", "CPU TEMP", "23°C"))
    assert w.last_frame() == ("text", "CPU TEMP", "23°C")


def test_aura_preview_handles_list(qtbot, qapp):
    from polylux.ui.widgets.live_preview import AuraLivePreview
    w = AuraLivePreview()
    qtbot.addWidget(w)
    w.set_frame([(193, 95, 60), (0, 0, 0), (255, 255, 255)])
    assert w.last_frame() == [(193, 95, 60), (0, 0, 0), (255, 255, 255)]


def test_sidebar_emits_nav_changed(qtbot, qapp):
    from polylux.ui.sidebar import Sidebar
    sb = Sidebar(items=[("dash", "Dashboard"), ("matrix", "Anime Matrix")])
    qtbot.addWidget(sb)
    with qtbot.waitSignal(sb.nav_changed, timeout=500) as blocker:
        sb.set_active("matrix")
    assert blocker.args == ["matrix"]


def test_sidebar_default_active_is_first(qtbot, qapp):
    from polylux.ui.sidebar import Sidebar
    sb = Sidebar(items=[("a", "A"), ("b", "B")])
    qtbot.addWidget(sb)
    assert sb.active() == "a"
