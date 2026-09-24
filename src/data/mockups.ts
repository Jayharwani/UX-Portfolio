/* --------------------------------------------------------------------------
   MOCKUP MARKUP

   Lifted verbatim from reference/index.html by scripts/extract-mockups.py.
   The reference is the visual source of truth, so these are extracted rather
   than retyped and cannot drift from the thing they were checked against.

   They are strings because they are injected, and they are injected because
   each animation is a CSS keyframe tied to an `.on` class: replaying one
   means re-creating its nodes. In React that is a key change rather than an
   innerHTML assignment, but the markup still has to arrive as markup.

   Static, authored here, and never touched by anything a visitor can type,
   which is the only reason dangerouslySetInnerHTML is defensible.
   -------------------------------------------------------------------------- */

export type MockupKey = "friction" | "headroom" | "signal" | "chrono" | "bumper";

export const MOCKUPS: Record<MockupKey, string> = {
  /* Friction: ten thousand reviews sifted to the hundred and fifty that
     reach a model. Authored here rather than extracted, because Friction
     post-dates reference/index.html and has no row in it. */
  friction:
    "<div class=\"card\"><div class=\"cap\"><span>LAST SCAN</span><span class=\"dotlive\"><i></i>WEEKLY</span></div><div class=\"amt\"><span data-count=\"9994\">0</span></div><div class=\"sub\">public reviews read</div><div class=\"frows\"><i style=\"width:92%\"></i><i class=\"k\" style=\"width:74%\"></i><i style=\"width:86%\"></i><i style=\"width:58%\"></i><i style=\"width:96%\"></i><i class=\"k\" style=\"width:68%\"></i><i style=\"width:80%\"></i><i style=\"width:64%\"></i><i style=\"width:90%\"></i><i class=\"k\" style=\"width:52%\"></i><i style=\"width:76%\"></i><i style=\"width:88%\"></i></div><div class=\"fout\"><b>150</b><span>TO THE MODEL</span></div></div>",
  headroom:
    "<div class=\"card\"><div class=\"cap\"><span>SAFE TO SPEND</span><span class=\"dotlive\"><i></i>LIVE</span></div><div class=\"amt\"><small>$</small><span data-count=\"412\">0</span></div><div class=\"sub\">4 days until payday</div><div class=\"week\"><i></i><i></i><i></i><i class=\"now\"></i><i></i></div><div class=\"dlab\"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span></div></div>",
  signal:
    "<div class=\"sig\"><div class=\"grid2\"></div><div class=\"land\" style=\"left:8%;top:18%;width:46%;height:52%\"></div><div class=\"land\" style=\"left:54%;top:46%;width:38%;height:44%\"></div><div class=\"chip\"><i></i>LIVE \u00b7 <span data-count=\"14\">0</span> THIS WEEK</div><span class=\"evt\" style=\"left:24%;top:44%\"></span><span class=\"evt\" style=\"left:41%;top:62%\"></span><span class=\"evt\" style=\"left:33%;top:31%\"></span><span class=\"evt\" style=\"left:68%;top:71%\"></span><span class=\"evt\" style=\"left:76%;top:54%\"></span><span class=\"evt\" style=\"left:50%;top:38%\"></span><div class=\"tip\"><b>DMV Design Night</b><span>TUE \u00b7 7:00 PM</span></div></div>",
  chrono:
    "<div class=\"card\" style=\"width:230px\"><div class=\"cap\"><span>FOCUS BLOCK</span><span class=\"dotlive\"><i></i>RUNNING</span></div><div class=\"ring2\"><div class=\"wave\"></div><svg width=\"132\" height=\"132\"><circle class=\"bg\" cx=\"66\" cy=\"66\" r=\"62\"/><circle class=\"fg\" cx=\"66\" cy=\"66\" r=\"62\"/></svg><div class=\"mid\"><b data-clock=\"1\">24:00</b><i>REMAINING</i></div></div><div class=\"nudge\"><b>Gentle nudge</b><span>Halfway through. Feel the pulse.</span></div></div>",
  bumper:
    "<div class=\"browser\"><div class=\"top\"><i></i><i></i><i></i><span>checkout.store/cart</span></div><div class=\"cart\"><div class=\"th\"></div><div class=\"ls\"><i></i><i></i></div><b>$89.00</b></div><div class=\"inter\"><div class=\"h\"><i></i>BUMPER</div><p>Wait. Do you need this, or do you want it?</p><div class=\"btns\"><button class=\"a\">Sleep on it</button><button class=\"b\">Buy anyway</button></div></div><svg class=\"cursor\" viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"M5 3 19 11.5l-6.4 1.3L9.6 19 5 3Z\"/></svg></div>",
};
