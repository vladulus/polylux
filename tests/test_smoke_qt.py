def test_qt_starts(qtbot, qapp):
    from PyQt6.QtWidgets import QLabel
    w = QLabel("hello")
    qtbot.addWidget(w)
    assert w.text() == "hello"
