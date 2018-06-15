import PropTypes from "prop-types";
import React, {Fragment} from "react";
import {Layer} from "./Main";
import {BaseballField, FootballField} from "./svgs";

export class Venue extends React.PureComponent {
    static propTypes = {
        venue: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
            type: PropTypes.string.isRequired,
        }),
        onChange: PropTypes.func.isRequired,
        getCoordinates: PropTypes.func.isRequired,
        selected: PropTypes.bool,
        onClick: PropTypes.func,
    };

    state = {
        pointClicked: null,
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
    };

    onMouseUp = () => {
        const {onChange, venue} = this.props;
        onChange({
            ...venue,
            ...this.getPosition(this.state)
        });
        this.setState({
            pointClicked: null,
            x: 0,
            y: 0,
        })
    };

    onPointClick = (e, pointClicked) => {
        this.setState((_, {venue: {x, y, width, height}}) => ({
            pointClicked,
            ...({
                1: {
                    startX: x + width,
                    startY: y + height,
                    x,
                    y
                },
                2: {
                    pointClicked,
                    startX: x,
                    startY: y + height,
                    x: x + width,
                    y
                },
                3: {
                    pointClicked,
                    startX: x,
                    startY: y,
                    x: x + width,
                    y: y + height
                },
                4: {
                    pointClicked,
                    startX: x + width,
                    startY: y,
                    x,
                    y: y + height
                }
            }[pointClicked])
        }))
    };

    getPosition = ({pointClicked, x, y, startX, startY}) => ({
        x: Math.min(startX, x),
        y: Math.min(startY, y),
        width: Math.abs(x - startX),
        height: Math.abs(y - startY),
    });


    render() {
        const {
            getCoordinates,
            selected,
            venue,
            ...props
        } = this.props;

        const {pointClicked} = this.state;

        const {
            x,
            y,
            width,
            height,
        } = pointClicked ? this.getPosition(this.state) : venue;

        const venueProps = {
            ...props,
            x,
            y,
            width,
            height,
            onClick: e => e.stopPropagation(),
            style: {
                cursor: 'move',
            }
        };

        const styles = {
            point: {
                fill: 'white',
                stroke: '#777',
                cursor: pointClicked ? '-webkit-grabbing' : '-webkit-grab'
            },
            layer: {
                cursor: '-webkit-grabbing',
            }
        };
        return (
            <Fragment>
                {venue.type === 'football' ? (
                    <FootballField {...venueProps}/>
                ) : venue.type === 'baseball' && (
                    <BaseballField {...venueProps}/>
                )}
                {selected && (
                    <Fragment>
                        <rect
                            fill="none"
                            stroke="#777"
                            {...venueProps}
                            style={{pointerEvents: 'none'}}
                        />
                        <circle
                            cx={x}
                            cy={y}
                            r="5"
                            style={styles.point}
                            onMouseDown={e => this.onPointClick(e, 1)}
                        />
                        <circle
                            cx={x + width}
                            cy={y}
                            r="5"
                            style={styles.point}
                            onMouseDown={e => this.onPointClick(e, 2)}
                        />
                        <circle
                            cx={x + width}
                            cy={y + height}
                            r="5"
                            style={styles.point}
                            onMouseDown={e => this.onPointClick(e, 3)}
                        />
                        <circle
                            cx={x}
                            cy={y + height}
                            r="5"
                            style={styles.point}
                            onMouseDown={e => this.onPointClick(e, 4)}
                        />
                    </Fragment>
                )}
                {pointClicked !== null && (
                    <Layer
                        style={styles.layer}
                        onMouseMove={e => this.setState(getCoordinates(e.clientX, e.clientY))}
                        onMouseUp={this.onMouseUp}
                    />
                )}
            </Fragment>
        )
    }
}


export class VenueCreator extends React.PureComponent {
    static propTypes = {
        onSuccess: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        getCoordinates: PropTypes.func.isRequired,
        venueType: PropTypes.node.isRequired
    };

    state = {
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        drawStart: false,
    };

    onStart = e => {
        const {getCoordinates} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        this.setState({
            startX: x,
            startY: y,
            drawStart: true
        })
    };

    onEnd = e => {
        const {getCoordinates, venueType} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        const {onSuccess, onCancel} = this.props;
        const {startX, startY, drawStart} = this.state;

        if(drawStart && startX !== x && startY !== y)
            onSuccess({
                x: Math.min(startX, x),
                y: Math.min(startY, y),
                width: Math.abs(x - startX),
                height: Math.abs(y - startY),
                type: venueType
            });
        else
            onCancel();

        this.setState({
            startX: 0,
            startY: 0,
            x: 0,
            y: 0,
            drawStart: false,
        });
    };

    render() {
        const {getCoordinates, venueType} = this.props;
        const {drawStart, x, y, startX, startY} = this.state;
        const styles = {
            layer: {
                cursor: 'crosshair'
            },
        };
        const venueProps = {
            x: Math.min(startX, x),
            y: Math.min(startY, y),
            width: Math.abs(x - startX),
            height: Math.abs(y - startY),
        };
        return (
            <Fragment>
                {drawStart && (
                    <Fragment>
                        {venueType === 'football' ? (
                            <FootballField {...venueProps}/>
                        ) : venueType === 'baseball' && (
                            <BaseballField {...venueProps}/>
                        )}
                        <polyline
                            fill="none"
                            stroke="#777"
                            points={`
                                ${startX} ${startY}
                                ${x} ${startY}
                                ${x} ${y}
                                ${startX} ${y}
                                ${startX} ${startY}
                            `}
                        />
                    </Fragment>
                )}
                <Layer
                    style={styles.layer}
                    onMouseMove={e => this.setState(getCoordinates(e.clientX, e.clientY))}
                    onClick={drawStart ? this.onEnd : this.onStart}
                />
            </Fragment>
        )
    }
}