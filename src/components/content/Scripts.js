import React from 'react';
import Script from 'next/script';

export default function Scripts({ src }) {
    return (
        <>

            <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js" strategy={"beforeInteractive"}/>
            <Script src="https://cdn.jsdelivr.net/npm/chart.js" strategy={"beforeInteractive"}/>

            <Script src={src||''+`vendors/js/vendor.bundle.base.js`} strategy={"beforeInteractive"}/>

            <Script src={src||''+"vendors/chart.js/Chart.min.js"} strategy={"beforeInteractive"}/>
            <Script src={src||''+"vendors/bootstrap-datepicker/bootstrap-datepicker.min.js"} strategy={"beforeInteractive"}/>
            <Script src={src||''+"vendors/progressbar.js/progressbar.min.js"} strategy={"beforeInteractive"}/>

            <Script src={src||''+"js/off-canvas.js"} strategy={"beforeInteractive"}/>
            <Script src={src||''+"js/hoverable-collapse.js"} strategy={"beforeInteractive"}/>
            <Script src={src||''+"js/template.js"} strategy={"beforeInteractive"}/>
            <Script src={src||''+"js/settings.js"} strategy={"beforeInteractive"}/>
            <Script src={src||''+"js/todolist.js"} strategy={"beforeInteractive"}/>

            <Script src={src||''+"js/jquery.cookie.js"} type="text/javascript" strategy={"beforeInteractive"}/>
            <Script src={src||''+"js/Chart.roundedBarCharts.js"} strategy={"beforeInteractive"}/>
        </>
    )
}