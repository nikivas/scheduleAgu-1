$(document).on("click", ".chislit-tab", function() {
  $(".td_style2_zn").addClass("dnphone");
  $(".znamenat-tab").removeClass("active");
  $(".td_style2_ch").removeClass("dnphone");
  $(".chislit-tab").addClass("active");
  $(".den-content").addClass("chislit-day");
  $(".den-content").removeClass("znamenat-day");
});
$(document).on("click", ".znamenat-tab", function() {
  $(".td_style2_ch").addClass("dnphone");
  $(".chislit-tab").removeClass("active");
  $(".td_style2_zn").removeClass("dnphone");
  $(".znamenat-tab").addClass("active");
  $(".den-content").removeClass("chislit-day");
  $(".den-content").addClass("znamenat-day");
});
