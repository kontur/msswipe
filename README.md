msswipe
===

Helper for handling swipe gestures with Internet Explorer 10's MSPointer model


Example usage:
---

    if (window.navigator.msPointerEnabled) {
       $(".swipeable").each(function () {
           msswipe.addEventListener($(this), function (event, direction, $this) {
               switch (direction) {
                   case "right": ... break;
                   case "up":    ... break;
                   case "left":  ... break;
                   case "down":  ... break;
               }
           }
       });
    }