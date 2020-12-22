import React, { useEffect, useRef } from 'react'
import { useDimensions, useTheme, Container } from '@nivo/core'
import { InheritedColorConfig, OrdinalColorScaleConfig } from '@nivo/colors'
import { CirclePackingCanvasProps, ComputedDatum } from './types'
import { defaultProps } from './props'
import { useCirclePacking } from './hooks'

const InnerCirclePackingCanvas = <RawDatum,>({
    data,
    id = defaultProps.id,
    value = defaultProps.value,
    valueFormat,
    width,
    height,
    margin: partialMargin,
    padding = defaultProps.padding,
    colors = defaultProps.colors as OrdinalColorScaleConfig<
        Omit<ComputedDatum<RawDatum>, 'color' | 'fill'>
    >,
    colorBy = defaultProps.colorBy,
    childColor = defaultProps.childColor as InheritedColorConfig<ComputedDatum<RawDatum>>,
    // layers = defaultProps.layers,
    isInteractive,
    role = defaultProps.role,
}: Omit<
    Partial<CirclePackingCanvasProps<RawDatum>>,
    'data' | 'width' | 'height' | 'animate' | 'motionConfig'
> &
    Pick<CirclePackingCanvasProps<RawDatum>, 'data' | 'width' | 'height'>) => {
    const canvasEl = useRef<HTMLCanvasElement | null>(null)
    const theme = useTheme()

    const { margin, innerWidth, innerHeight, outerWidth, outerHeight } = useDimensions(
        width,
        height,
        partialMargin
    )

    const nodes = useCirclePacking<RawDatum>({
        data,
        id,
        value,
        valueFormat,
        width: innerWidth,
        height: innerHeight,
        padding,
        colors,
        colorBy,
        childColor,
    })

    const pixelRatio = 2

    useEffect(() => {
        if (!canvasEl.current) return

        canvasEl.current.width = outerWidth * pixelRatio
        canvasEl.current.height = outerHeight * pixelRatio

        const ctx = canvasEl.current.getContext('2d')!

        ctx.scale(pixelRatio, pixelRatio)

        ctx.fillStyle = theme.background
        ctx.fillRect(0, 0, outerWidth, outerHeight)

        ctx.save()
        ctx.translate(margin.left, margin.top)

        nodes.forEach(node => {
            ctx.save()

            //if (borderWidth > 0) {
            //    this.ctx.strokeStyle = getBorderColor(node)
            //    this.ctx.lineWidth = borderWidth
            //}

            ctx.beginPath()
            ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
            ctx.fillStyle = node.color
            ctx.fill()

            //if (borderWidth > 0) {
            //    this.ctx.stroke()
            //}
        })
    }, [
        canvasEl,
        innerWidth,
        innerHeight,
        outerWidth,
        outerHeight,
        margin.top,
        margin.left,
        pixelRatio,
        nodes,
        theme,
    ])

    return (
        <canvas
            ref={canvasEl}
            width={outerWidth * pixelRatio}
            height={outerHeight * pixelRatio}
            style={{
                width: outerWidth,
                height: outerHeight,
                cursor: isInteractive ? 'auto' : 'normal',
            }}
            role={role}
            //onMouseEnter={isInteractive ? handleMouseHover : undefined}
            //onMouseMove={isInteractive ? handleMouseHover : undefined}
            //onMouseLeave={isInteractive ? handleMouseLeave : undefined}
            //onClick={isInteractive ? handleClick : undefined}
        />
    )
}

export const CirclePackingCanvas = <RawDatum,>({
    isInteractive = defaultProps.isInteractive,
    theme,
    ...otherProps
}: Omit<Partial<CirclePackingCanvasProps<RawDatum>>, 'data' | 'width' | 'height'> &
    Pick<CirclePackingCanvasProps<RawDatum>, 'data' | 'width' | 'height'>) => (
    <Container isInteractive={isInteractive} theme={theme}>
        <InnerCirclePackingCanvas<RawDatum> isInteractive={isInteractive} {...otherProps} />
    </Container>
)