import React, {Fragment} from 'react';
import PropTypes from 'prop-types'
import ActionBar, {ActionButton} from "./ActionBar";
import {Delete, Square, Text as TextIcon, Polygon as PolygonIcon, Seat} from "./svgs";
import {green, lightBlue} from "../utils/colors";
import {v4} from 'uuid'
import {polygonType} from "../utils/types";
import * as ReactDOM from "react-dom";
import Input from "./Input";
import Radium from "radium";
import Button from "./Button";
import InsertVenueDialog from "./InsertVenueDialog";
import {Text, TextCreator} from "./Text";
import {Polygon, PolygonCreator, SquareCreator} from "./Polygon";
import {Venue, VenueCreator} from "./Venue";

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
        dragEndY: 0,
        venueDialogOpen: false,
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

    addVenue = ({x, y, width, height, type}) => {
        this.setState(({figures}) => ({
            addMode: null,
            figures: figures.concat({
                id: v4(),
                x,
                y,
                width,
                height,
                type,
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
            case 'baseball':
            case 'football':
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
        const {addMode, selectedFigureIds, dragging, venueDialogOpen} = this.state;
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
                    <ActionButton
                        label="Campo"
                        icon={<Seat/>}
                        onClick={() => this.setState({venueDialogOpen: true})}
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
                                {figures.map(figure =>
                                    (figure.type === 'polygon' || figure.type === 'section') ? (
                                        <Polygon
                                            key={figure.id}
                                            polygon={figure}
                                            onChange={this.onFigureChange}
                                            getCoordinates={this.getCoordinates}
                                            selected={selectedFigureIds.includes(figure.id)}
                                            onMouseDown={(e) => this.onDragStart(e, figure.id)}
                                        />
                                    ) : figure.type === 'text' ? (
                                        <Text
                                            key={figure.id}
                                            text={figure}
                                            selected={selectedFigureIds.includes(figure.id)}
                                            getCoordinates={this.getCoordinates}
                                            onMouseDown={(e) => this.onDragStart(e, figure.id)}
                                        />
                                    ) : (figure.type === 'football' || figure.type === 'baseball') && (
                                        <Venue
                                            key={figure.id}
                                            venue={figure}
                                            onChange={this.onFigureChange}
                                            selected={selectedFigureIds.includes(figure.id)}
                                            getCoordinates={this.getCoordinates}
                                            onMouseDown={(e) => this.onDragStart(e, figure.id)}
                                        />
                                    )
                                )}
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
                                {(addMode === 'football' || addMode === 'baseball') && (
                                    <VenueCreator
                                        onSuccess={this.addVenue}
                                        onCancel={() => this.setState({addMode: null})}
                                        getCoordinates={this.getCoordinates}
                                        venueType={addMode}
                                    />
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
                                    <PolygonFields
                                        figure={figure}
                                        onChange={this.onFigureChange}
                                    />
                                ) : figure.type === 'text' ? (
                                    <TextFields
                                        figure={figure}
                                        onChange={this.onFigureChange}
                                    />
                                ) : figure.type === 'section' && (
                                    <SectionFields
                                        figure={figure}
                                        onChange={this.onFigureChange}
                                    />
                                )}
                            </FigureRow>
                        ))}
                    </div>
                </div>
                <InsertVenueDialog
                    open={venueDialogOpen}
                    onClose={() => this.setState({venueDialogOpen: false})}
                    onInsert={venueType => this.setState({addMode: venueType, venueDialogOpen: false})}
                />
            </div>
        );
    }
}

export const Layer = ({style, ...props}) => (
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


const PolygonFields = ({figure, onChange}) => (
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

PolygonFields.propTypes = {
    figure: polygonType.isRequired,
    onChange: PropTypes.func.isRequired
};

const SectionFields = ({figure, onChange}) => (
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

const TextFields = ({figure, onChange}) => (
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