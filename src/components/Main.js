import React, {Fragment} from 'react';
import PropTypes from 'prop-types'
import ActionBar, {ActionButton} from "./ActionBar";
import {Delete, Square, Text as TextIcon, Polygon as PolygonIcon} from "./svgs";
import {green, lightBlue} from "../utils/colors";
import {v4} from 'uuid'
import {polygonType} from "../utils/types";
import * as ReactDOM from "react-dom";
import Input from "./Input";
import Radium from "radium";
import Button from "./Button";

const SvgContext = React.createContext();

export default class Main extends React.PureComponent {
    state = {
        figures: [],
        selectedFigureIds: [],
        addMode: null,
        dragging: false,
        dragStartX: 0,
        dragStartY: 0,
        dragEndX: 0,
        dragEndY: 0
    };

    componentDidMount() {
        window.addEventListener('resize', () => this.forceUpdate());
        window.addEventListener('keydown', this.onKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', () => this.forceUpdate());
        window.removeEventListener('keydown', this.onKeyDown);
    }

    onKeyDown = ({key}) => {
        if(key === 'Escape')
            this.setState({addMode: null})
    };

    ref = svg => {
        this.svg = svg;
        this.point = svg.createSVGPoint();
    };

    getCoordinates = (X, Y, round = true) => {
        this.point.x = X;
        this.point.y = Y;
        const {x, y} = this.point.matrixTransform(this.svg.getScreenCTM().inverse());
        return round ? {
            x: Math.round(x / 10) * 10,
            y: Math.round(y / 10) * 10,
        } : {
            x, y
        };
    };

    addPolygon = points => {
        this.setState(({figures}) => ({
            addMode: null,
            figures: figures.concat({
                id: v4(),
                color: green,
                type: 'polygon',
                points
            }),
        }))
    };

    toggleFigureSelected = id => {
        this.setState(({selectedFigureIds}) => ({
            selectedFigureIds: selectedFigureIds.includes(id)
                ? selectedFigureIds.filter(ID => ID !== id)
                : [...new Set(selectedFigureIds.concat(id))],
        }))
    };

    onDragStart = (e, id) => {
        e.preventDefault();
        const {x, y} = this.getCoordinates(e.clientX, e.clientY);
        this.setState(({selectedFigureIds}) => ({
            selectedFigureIds: [...new Set(selectedFigureIds.concat(id))],
            dragging: true,
            dragStartX: x,
            dragStartY: y,
            dragEndX: x,
            dragEndY: y,
        }))
    };

    onDrag = e => {
        const {x, y} = this.getCoordinates(e.clientX, e.clientY);
        this.setState({
            dragEndX: x,
            dragEndY: y,
        });
    };

    onDragEnd = () => {
        this.setState(state => ({
            figures: this.getDraggedFigures(state),
            dragging: false,
            dragStartX: 0,
            dragStartY: 0,
            dragEndX: 0,
            dragEndY: 0,
        }))
    };

    getDraggedFigures = ({
        figures,
        selectedFigureIds,
        dragStartX,
        dragStartY,
        dragEndX,
        dragEndY
    }) => figures.map(figure => {
        if(!selectedFigureIds.includes(figure.id))
            return figure;
        switch(figure.type) {
            case 'polygon':
            case 'section':
                return {
                    ...figure,
                    points: figure.points.map(
                        point => ({
                            x: point.x + dragEndX - dragStartX,
                            y: point.y + dragEndY - dragStartY,
                        })
                    )
                };
            case 'text':
                return {
                    ...figure,
                    x: figure.x + dragEndX - dragStartX,
                    y: figure.y + dragEndY - dragStartY,
                };
            default:
                return figure;
        }
    });


    onFigureChange = polygon => {
        this.setState(({figures}) => ({
            figures: figures.map(
                f => f.id !== polygon.id ? f : polygon
            )
        }));
    };

    onFigureDelete = id => {
        this.setState(({figures}) => ({
            figures: figures.filter(
                f => f.id !== id
            )
        }));
    };

    addText = ({x, y}) => {
        this.setState(({figures}) => ({
            addMode: null,
            figures: figures.concat({
                id: v4(),
                type: 'text',
                color: 'black',
                value: 'Texto',
                x,
                y
            }),
        }))
    };

    render() {
        const {addMode, selectedFigureIds, dragging} = this.state;
        const figures = dragging ? this.getDraggedFigures(this.state) : this.state.figures;
        const styles = {
            container: {
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                background: lightBlue
            },
            mainContainer: {
                display: 'flex',
                height: 0,
                flexGrow: 1
            },
            svgContainer: {
                flexGrow: 1,
            },
            svg: {
                border: '1px solid #ddd',
                height: '100%',
                display: 'block',
                margin: '0 auto',
                background: 'white',
            },
            sidebar: {
                background: 'white',
                width: 300,
                height: '100%',
                borderLeft: '1px solid #ddd',
                overflow: 'auto'
            },
            polygonRow: {
                borderBottom: '1px solid #ddd',
                padding: 10
            }
        };
        return (
            <div style={styles.container}>
                <ActionBar>
                    <ActionButton
                        label="Polígono"
                        icon={<PolygonIcon/>}
                        onClick={() => this.setState({addMode: 'polygon'})}
                    />
                    <ActionButton
                        label="Cuadrado"
                        icon={<Square/>}
                        onClick={() => this.setState({addMode: 'square'})}
                    />
                    <ActionButton
                        label="Texto"
                        icon={<TextIcon/>}
                        onClick={() => this.setState({addMode: 'text'})}
                    />
                </ActionBar>
                <div style={styles.mainContainer}>
                    <SvgContext.Provider value={this.svg}>
                        <div
                            style={styles.svgContainer}
                            onClick={() => this.setState({selectedFigureIds: []})}
                            onMouseMove={dragging ? this.onDrag : undefined}
                            onMouseUp={this.onDragEnd}
                        >
                            <svg
                                viewBox="0 0 1000 1000"
                                style={styles.svg}
                                ref={this.ref}
                            >
                                <Grid lines={100} step={10}/>
                                {addMode === 'square' && (
                                    <SquareCreator
                                        onSuccess={this.addPolygon}
                                        onCancel={() => this.setState({addMode: null})}
                                        getCoordinates={this.getCoordinates}
                                    />
                                )}
                                {addMode === 'polygon' && (
                                    <PolygonCreator
                                        onSuccess={this.addPolygon}
                                        onCancel={() => this.setState({addMode: null})}
                                        getCoordinates={this.getCoordinates}
                                    />
                                )}
                                {addMode === 'text' && (
                                    <TextCreator
                                        onSuccess={this.addText}
                                        onCancel={() => this.setState({addMode: null})}
                                        getCoordinates={this.getCoordinates}
                                    />
                                )}
                                {figures.map(figure =>
                                    (figure.type === 'polygon' || figure.type === 'section') ? (
                                        <Polygon
                                            key={figure.id}
                                            polygon={figure}
                                            onChange={figure => this.onFigureChange(figure)}
                                            getCoordinates={this.getCoordinates}
                                            selected={selectedFigureIds.includes(figure.id)}
                                            onMouseDown={(e) => this.onDragStart(e, figure.id)}
                                        />
                                    ) : figure.type === 'text' && (
                                        <Text
                                            key={figure.id}
                                            text={figure}
                                            selected={selectedFigureIds.includes(figure.id)}
                                            getCoordinates={this.getCoordinates}
                                            onMouseDown={(e) => this.onDragStart(e, figure.id)}
                                        />
                                    )
                                )}
                            </svg>
                        </div>
                    </SvgContext.Provider>
                    <div style={styles.sidebar}>
                        {figures.map((figure, i) => (
                            <FigureRow
                                key={figure.id}
                                index={i}
                                selected={selectedFigureIds.includes(figure.id)}
                                onClick={() => this.toggleFigureSelected(figure.id)}
                                onDelete={() => this.onFigureDelete(figure.id)}
                            >
                                {figure.type === 'polygon' ? (
                                    <PolygonRow
                                        figure={figure}
                                        onChange={this.onFigureChange}
                                    />
                                ) : figure.type === 'text' ? (
                                    <TextRow
                                        figure={figure}
                                        onChange={this.onFigureChange}
                                    />
                                ) : figure.type === 'section' && (
                                    <SectionRow
                                        figure={figure}
                                        onChange={this.onFigureChange}
                                    />
                                )}
                            </FigureRow>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

const Layer = ({style, ...props}) => (
    <SvgContext.Consumer>
        {svg => {
            const {
                top,
                left,
                width,
                height
            } = svg ? svg.getBoundingClientRect() : {};
            const defaultStyle = {
                width,
                height,
                top,
                left,
                position: 'fixed',
                ...style
            };
            return ReactDOM.createPortal((
                <div
                    {...props}
                    style={defaultStyle}
                />
            ), document.getElementById('modal-root'));
        }}
    </SvgContext.Consumer>
);

const DeleteButton = Radium(Delete);

const FigureRow = ({style, children, index, selected, onDelete, ...props}) => {
    const _onDelete = e => {
        e.stopPropagation();
        onDelete()
    };
    const styles = {
        container: {
            borderBottom: '1px solid #ddd',
            padding: 10,
            background: selected && '#eee',
            cursor: 'pointer',
            ...props
        },
        header: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10
        },
        body: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: 15,
            alignItems: 'flex-end'
        },
        button: {
            fill: '#999',
            ':hover': {
                fill: '#333'
            }
        }
    };

    return (
        <div
            style={styles.container}
            {...props}
        >
            <div style={styles.header}>
                <div>{`Figura ${index + 1}`}</div>
                <DeleteButton
                    onClick={_onDelete}
                    style={styles.button}
                />
            </div>
            <div style={styles.body}>
                {children}
            </div>
        </div>
    )
};


const PolygonRow = ({figure, onChange}) => (
    <Fragment>
        <Input
            label="Color"
            style={{width: '100%'}}
            value={figure.color}
            type="color"
            onChange={(e, color) => onChange(({
                ...figure,
                color
            }))}
        />
        <Button
            style={{margin: 0}}
            label="Marcar como sección"
            onClick={() => onChange(({
                ...figure,
                type: 'section',
                code: '',
                availability: 0,
                svg: null
            }))}
        />
    </Fragment>
);

PolygonRow.propTypes = {
    figure: polygonType.isRequired,
    onChange: PropTypes.func.isRequired
};

const SectionRow = ({figure, onChange}) => (
    <Fragment>
        <Input
            label="Código"
            style={{width: '100%'}}
            value={figure.code}
            onChange={(e, code) => onChange(({
                ...figure,
                code
            }))}
        />
        <Input
            label="Disponibilidad"
            style={{width: '100%'}}
            type="number"
            value={figure.availability}
            onChange={(e, availability) => onChange(({
                ...figure,
                availability
            }))}
        />
        <Input
            label="Color"
            style={{width: '100%'}}
            value={figure.color}
            type="color"
            onChange={(e, color) => onChange(({
                ...figure,
                color
            }))}
        />
        <Button
            style={{margin: 0}}
            label="Agregar numeración"
        />
    </Fragment>
);

const TextRow = ({figure, onChange}) => (
    <Input
        label="Texto"
        style={{width: '100%'}}
        value={figure.value}
        onChange={(e, value) => onChange(({
            ...figure,
            value
        }))}
    />
);

class Text extends React.PureComponent {
    static propTypes = {
        text: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            value: PropTypes.string.isRequired,
        }),
        getCoordinates: PropTypes.func.isRequired,
        selected: PropTypes.bool,
    };

    state = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    componentDidMount() {
        this.measure();
    }

    componentDidUpdate() {
        this.measure();
    }

    measure = () => {
        const {
            x,
            y,
            width,
            height
        } = this.text ? this.text.getBBox() : {};
        if(
            (x !== this.state.x)
            || (y !== this.state.y)
            || (width !== this.state.width)
            || (height !== this.state.height)
        )
            this.setState({x, y, width, height})

    };

    render() {
        const {text, selected, onMouseDown} = this.props;
        const {
            x,
            y,
            width,
            height
        } = this.text ? this.text.getBBox() : {};
        const styles = {
            text: {
                cursor: 'pointer'
            },
            box: {
                fill: 'none',
                stroke: 'black',
                strokeDasharray: 2
            }
        };
        return (
            <Fragment>
                <text
                    x={text.x}
                    y={text.y}
                    style={styles.text}
                    onClick={e => e.stopPropagation()}
                    ref={text => this.text = text}
                    onMouseDown={onMouseDown}
                >
                    {text.value}
                </text>
                {selected && (
                    <rect
                        style={styles.box}
                        x={x - 5}
                        y={y - 5}
                        width={width + 10}
                        height={height + 10}
                    />
                )}
            </Fragment>
        )
    }
}

class TextCreator extends React.PureComponent {
    static propTypes = {
        onSuccess: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        getCoordinates: PropTypes.func.isRequired
    };
    state = {
        x: 0,
        y: 0,
    };

    onEnd = e => {
        const {getCoordinates} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        const {onSuccess} = this.props;
        onSuccess({x, y});
        this.setState({
            x: 0,
            y: 0,
        });
    };

    render() {
        const {getCoordinates} = this.props;
        const {x, y} = this.state;
        const styles = {
            layer: {
                cursor: 'crosshair'
            },
            text: {
                pointerEvents: 'none',
            }
        };
        return (
            <Fragment>
                <text
                    style={styles.text}
                    x={x}
                    y={y}
                >
                    Texto
                </text>
                <Layer
                    style={styles.layer}
                    onMouseMove={e => this.setState(getCoordinates(e.clientX, e.clientY))}
                    onClick={this.onEnd}
                />
            </Fragment>
        )
    }
}

class SquareCreator extends React.PureComponent {
    static propTypes = {
        onSuccess: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        getCoordinates: PropTypes.func.isRequired
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
        const {getCoordinates} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        const {onSuccess, onCancel} = this.props;
        const {startX, startY, drawStart} = this.state;

        if(drawStart && startX !== x && startY !== y)
            onSuccess([{
                x: startX,
                y: startY
            }, {
                x: x,
                y: startY
            }, {
                x: x,
                y: y
            }, {
                x: startX,
                y: y
            }]);
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
        const {getCoordinates} = this.props;
        const {drawStart, x, y, startX, startY} = this.state;
        const styles = {
            layer: {
                cursor: 'crosshair'
            }
        };
        return (
            <Fragment>
                {drawStart && (
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

class PolygonCreator extends React.PureComponent {
    static propTypes = {
        onSuccess: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        getCoordinates: PropTypes.func.isRequired
    };
    state = {
        points: [],
        x: 0,
        y: 0
    };

    onClick = e => {
        const {getCoordinates} = this.props;
        const {x, y} = getCoordinates(e.clientX, e.clientY);
        this.setState(({points}) => ({
            points: points.concat({x, y})
        }))
    };

    onDoubleClick = e => {
        e.preventDefault();
        const {onSuccess, onCancel} = this.props;
        const points = this.state.points.slice(0, -1);
        if(points.length > 2)
            onSuccess(points);
        else
            onCancel();
        this.setState({points: []});
    };

    render() {
        const {getCoordinates} = this.props;
        const {points, x, y} = this.state;
        const styles = {
            layer: {
                cursor: 'crosshair'
            }
        };
        return (
            <Fragment>
                <polyline
                    fill="none"
                    stroke="#777"
                    points={points.concat({x, y}).map(
                        ({x, y}) => `${x} ${y}`
                    ).join(' ')}
                />
                <Layer
                    style={styles.layer}
                    onClick={this.onClick}
                    onMouseMove={e => this.setState(getCoordinates(e.clientX, e.clientY))}
                    onDoubleClick={this.onDoubleClick}
                />
            </Fragment>
        )
    }
}

class Polygon extends React.PureComponent {
    static propTypes = {
        polygon: polygonType.isRequired,
        onChange: PropTypes.func.isRequired,
        getCoordinates: PropTypes.func.isRequired,
        selected: PropTypes.bool,
        onClick: PropTypes.func,
    };

    state = {
        pointClicked: null,
        x: 0,
        y: 0,
    };

    onMouseUp = () => {
        const {onChange, polygon} = this.props;
        onChange({
            ...polygon,
            points: this.getPoints(this.state, this.props)
        });
        this.setState({
            pointClicked: null,
            x: 0,
            y: 0,
        })
    };

    getPoints = ({pointClicked, x, y}, {polygon}) => polygon.points.map(
        (point, i) => i !== pointClicked ? point : {
            x,
            y
        }
    );

    render() {
        const {polygon, getCoordinates, selected, ...props} = this.props;
        const {pointClicked} = this.state;
        const points = this.getPoints(this.state, this.props);

        const styles = {
            polygon: {
                stroke: 'black',
                strokeWidth: selected ? 1 : 0,
                fill: polygon.color,
                cursor: 'move',
            },
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
                <polygon
                    {...props}
                    points={points.map(({x, y}) => `${x} ${y}`).join(' ')}
                    style={styles.polygon}
                    onClick={e => e.stopPropagation()}
                />
                {selected && points.map(({x, y}, i) => (
                    <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="5"
                        style={styles.point}
                        onMouseDown={e => this.setState({
                            ...getCoordinates(e.clientX, e.clientY),
                            pointClicked: i
                        })}
                    />
                ))}
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

const Grid = ({lines, step}) => {
    return Array.from({length: lines - 1}, (_, i) => (
        <React.Fragment key={i}>
            <line
                x1="0"
                x2="1000"
                y1={(i + 1) * step}
                y2={(i + 1) * step}
                stroke="#eee"
                strokeWidth="1"
            />
            <line
                x1={(i + 1) * step}
                x2={(i + 1) * step}
                y1="0"
                y2="1000"
                stroke="#eee"
                strokeWidth="1"
            />
        </React.Fragment>
    ));
};