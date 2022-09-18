import React from 'react'
import Script from "next/script";

export default function FourOhFour () {
    return <>
        <Script
            crossOrigin="anonymous"
            async="true"
            strategy="beforeInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3673520795587574"
        />
        <p>404 Not Found</p>
        <p><a href="/">Take me home</a></p>
    </>
}