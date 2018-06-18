import {FIELD_SPACE, LETTERS_SPACE} from "../components/SectionEditor";

const scripts = `
<style type="text/css">
    .svg-section-text{
        font-family:"Proxima Nova", Roboto-Regular, Roboto, SansSerif;
        text-anchor: middle; 
        dominant-baseline: central; 
        pointer-events:none; 
    }
    .svg-seat-disabled{
        fill:#155196;
    }
    .svg-seat-disabled-friend{
        fill:#00B1CD;
    }
    .svg-seat-circles{
        fill:#5B5B5B;
        transition:all .2s;
        transform-origin:center;
        transform:scale(1);
        stroke:white;
        stroke-width:0;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        transform-box:fill-box;
    }
    .selected{
        fill:#8BC34A !important;
    }
    .disabled{
        pointer-events:none !important;
    }
    .big{
        transform:scale(1.5);
    }
</style>
<script  type="text/javascript">
    function seat_click(evt) {
        var seat = evt.target;
        var currentSeatCode = seat.getAttribute(&quot;id&quot;);
    
        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf(&quot;android&quot;) &gt; -1;
        
        if(!seat.classList.contains(&quot;selected&quot;)){
            seat.classList.add(&quot;selected&quot;);
            setTimeout(function(){
                seat.classList.add(&quot;big&quot;);
            },0);
    
            setTimeout(function(){
                seat.classList.remove(&quot;big&quot;);
            },300);
    
            if(isAndroid){
                Android.selectSeat(currentSeatCode);
            }else{
                var url = &apos;bmsection&apos; + &apos;://&apos; + &apos;seatselected&apos; + &quot;#&quot; + currentSeatCode;
                document.location.href = url;
            }
    
        }else{
            seat.classList.remove(&quot;selected&quot;);
            setTimeout(function(){
                seat.classList.add(&quot;big&quot;);
            },0);
    
            setTimeout(function(){
                seat.classList.remove(&quot;big&quot;);
            },300);
    
            if(isAndroid){
                Android.removeSeat(currentSeatCode);
            }else{
                var url = &apos;bmsection&apos; + &apos;://&apos; + &apos;seatremoved&apos; + &quot;#&quot; + currentSeatCode;
                document.location.href = url;
            }
        }
    }
    function set_section(jsonSection){
        var section = JSON.parse(jsonSection);
    
        section.seats.forEach(function(seat){
            var s = document.getElementById(seat.code);
            if(s){
                s.style.fill=seat.color==&quot;#8BC34A&quot;?&quot;#5B5B5B&quot;:seat.color;
                if(seat.available==0){
                    s.classList.add(&quot;disabled&quot;);
                }
            }
        });
    }
    function clear_seat(seatcode){
        setTimeout(function(){
            var s = document.getElementById(seatcode);
            if(s) s.classList.remove(&quot;selected&quot;);
        },1000);
    }
    var seats = document.getElementsByClassName(&apos;svg-seat-circles&apos;);
   
    window.onload = function(){
        for(var i = seats.length - 1;i &gt;= 0; i--){
            seats[i].addEventListener(&apos;click&apos;,seat_click);
        }
    };
</script>
`;

const getField = viewBox => {
    const [left, top, width, height] = viewBox.split(' ');
    return `<text class="svg-section-text" style="font-size: ${FIELD_SPACE / 3}px" x="${(width - left) / 2 + LETTERS_SPACE / 2}" y="${height - top - FIELD_SPACE / 2}">CAMPO</text>`
};

export const getSvgHtml = ({viewBox, rows}) => `
<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">
    ${scripts}
    ${rows.map(({cols}) => cols.map(({x, y, radium, row, col}) =>
    `<circle class="svg-seat-circles" id="${row}-${col}" cx="${x}" cy="${y}" r="${radium}"/>`).join(`
    `)).join(`
    `)}
    
    <g class="svg-section-text">
    ${rows.map(({x, y, name, size}) =>
    `    <text x="${x}" y="${y}" style="font-size: ${size}">${name}</text>`).join(`
    `)}
                    
    ${rows.map(({cols}) => cols.map(({x, y, radium, row, col}) =>
    `    <text x="${x}" y="${y}" style="fill:white; font-size: ${radium / 2}">${row}-${col}</text>`).join(`
    `)).join(`
    `)}
    </g>
    ${getField(viewBox)}
</svg>
`;