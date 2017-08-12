/*
 * This file is part of the nivo project.
 *
 * Copyright 2016-present, Raphaël Benitte.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
import React, { PureComponent } from 'react'
import TableTooltip from '../../tooltip/TableTooltip'

const Chip = ({ color }) =>
    <span style={{ display: 'block', width: '12px', height: '12px', background: color }} />

export default class LineSlicesItem extends PureComponent {
    state = {
        isHover: false,
    }

    handleMouseEnter = e => {
        this.setState({ isHover: true })

        const { slice, showTooltip } = this.props
        showTooltip(
            <TableTooltip
                rows={slice.points.map(p => [<Chip color={p.color} />, p.id, p.value])}
            />,
            e
        )
    }

    handleMouseLeave = () => {
        this.setState({ isHover: false })
        this.props.hideTooltip()
    }

    render() {
        const { slice, height } = this.props
        const { isHover } = this.state

        return (
            <g transform={`translate(${slice.x}, 0)`}>
                {isHover &&
                    <line
                        x1={0}
                        x2={0}
                        y1={0}
                        y2={height}
                        stroke="#000"
                        strokeOpacity={0.35}
                        strokeWidth={1}
                    />}
                <rect
                    x={-20}
                    width={40}
                    height={height}
                    fill="#000"
                    fillOpacity={0}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseMove={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                />
            </g>
        )
    }
}