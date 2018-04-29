// jsKeypressbinding
kb = typeof kb !== 'undefined' ? kb : {}

kb.ctrl_s = function() {
 cb.prismatic()
}

kb.ctrl_d = function() {
 cb.strike('d')
}

kb.ctrl_dot = function() {
 var t = target
 cb.reset(t)
}

kb.ctrl_p = function() {
 cb.strike('p')
}
kb.ctrl_f = function() {
 cb.strike('f')
}
kb.ctrl_r = function() {
 cb.strike('r')
}
kb.ctrl_e = function() {
 cb.strike('e')
}
kb.ctrl_l = function() {
 cb.strike('l')
}
kb.ctrl_k = function() {
 cb.strike('k')
}