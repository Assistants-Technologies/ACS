import React from 'react';

export default function StatsRow({ project }) {
    return (
        <div className="d-sm-flex align-items-center justify-content-between border-bottom">
            <a><b>Statistics</b></a>
            <div>
                <div className="btn-wrapper">
                    <a href="#" className="btn btn-primary text-white me-0">
                        <i className="icon-download" /> Export
                    </a>
                </div>
            </div>
        </div>
    )
}