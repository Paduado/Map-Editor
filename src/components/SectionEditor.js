import * as React from 'react'
import PropTypes from 'prop-types'
import {seatType} from "../utils/types";
import {green} from "../utils/colors";
import Selector from "./Selector";
// import shortid from 'shortid'
import GenerateSectionDialog from "./GenerateSectionDialog";
import {Delete, Generate, Text, Undo} from "./svgs";
import Radium from "radium";

const getCodeLabel = (offset, startLabel, order) => {
    if(order === 'desc')
        offset *= -1;
    if(!isNaN(Number(startLabel)))
        return Number(startLabel) + offset;
    else
        return startLabel.replace(
            /.$/,
            c => String.fromCharCode(c.charCodeAt(0) + offset)
        );
};

const LETTERS_SPACE = 50;
const CIRCLE_WIDTH = .7;


export default class SectionEditor extends React.PureComponent {
    static propTypes = {};

    state = {
        generateDialogOpen: false,
        rowsAmount: 10,
        colsAmount: 10,
        colStartLabel: 1,
        rowStartLabel: 'A',
        circles: [],
        rows: [],
        selectedIds: [],
        viewBox: '0 0 1000 1000',
        seatMenuOpen: false,
        menuX: 0,
        menuY: 0,
        isUndo: false,
        history: []
    };

    componentDidMount() {
        window.addEventListener('keypress', this.onKeyPress)
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.onKeyPress)
    }

    componentDidUpdate(prevProps, prevState) {
        const {rows, isUndo} = this.state;
        if(rows !== prevState.rows) {
            if(isUndo)
                this.setState({isUndo: false});
            else
                this.setState(({history}) => ({
                    history: [...history, prevState.rows]
                }));
        }
    }

    onKeyPress = ({key, ctrlKey}) => {
        if(key === 'z' && ctrlKey)
            this.undo()
    };

    undo = () => {
        this.setState(({history}) => history.length ? ({
            rows: history.slice(-1)[0],
            history: history.slice(0, -1),
            isUndo: true
        }) : null);
    };

    generate = ({
        rows: rowsAmount,
        cols: colsAmount,
        rowsLabelType,
        colsLabelType,
        rowsOrder,
        colsOrder,
        rowsStart,
        colsStart
    }) => {
        const step = 1000 / Math.max(rowsAmount, colsAmount);
        const rowsArr = Array.from(
            {length: rowsAmount},
            (_, row) => getCodeLabel(row, rowsStart, rowsOrder)
        );
        const colsArr = Array.from(
            {length: colsAmount},
            (_, col) => getCodeLabel(col, colsStart, colsOrder)
        );

        this.setState({
            generateDialogOpen: false,
            radium: step / 2 * CIRCLE_WIDTH,
            rows: rowsArr.map((row, i) => ({
                name: row,
                index: i,
                y: step * (i + .5),
                circles: colsArr.map((col, j) => ({
                    id: `${i}-${j}`,
                    rowIndex: i,
                    index: j,
                    row,
                    col,
                    y: step * (i + .5),
                    x: step * (j + .5) + LETTERS_SPACE,
                }))
            })),
            viewBox: `0 0 ${Math.min(colsAmount / rowsAmount, 1) * 1000 + LETTERS_SPACE} ${Math.min(rowsAmount / colsAmount, 1) * 1000}`
        });
    };

    onSeatClick = (id, selected) => {
        this.setState(({selectedIds}) => ({
            selectedIds: selected
                ? selectedIds.filter(ID => ID !== id)
                : selectedIds.concat(id)
        }))
    };

    onRowChange = () => {
        const row = window.prompt('Ingresa la fila');
        if(!row)
            return;
        this.setState(({rows, selectedIds}) => ({
            rows: rows.map(r => ({
                ...r,
                circles: r.circles.map(
                    circle => !selectedIds.includes(circle.id)
                        ? circle
                        : {...circle, row}
                )
            }))
        }))
    };

    onColChange = () => {
        const col = window.prompt('Ingresa la fila');
        if(!col)
            return;
        this.setState(({rows, selectedIds}) => ({
            rows: rows.map(r => ({
                ...r,
                circles: r.circles.map(
                    circle => !selectedIds.includes(circle.id)
                        ? circle
                        : {...circle, col}
                )
            }))
        }))
    };

    onDelete = () => this.setState(({rows, selectedIds}) => ({
        rows: rows.map(row => ({
            ...row,
            circles: row.circles.filter(({id}) => !selectedIds.includes(id)),
        })),
        selectedIds: []
    }));

    onMultiSelect = ({x1, x2, y1, y2}) => {
        const point = this.svg.createSVGPoint();
        point.x = x1;
        point.y = y1;
        const {x: X1, y: Y1} = point.matrixTransform(this.svg.getScreenCTM().inverse());
        point.x = x2;
        point.y = y2;
        const {x: X2, y: Y2} = point.matrixTransform(this.svg.getScreenCTM().inverse());

        this.setState(({selectedIds, rows, radium}) => {
            const idsInRange = rows.reduce(
                (circles, row) => circles.concat(row.circles.map(
                    ({id, x, y}) => (
                        x - radium <= X2
                        && x + radium >= X1
                        && y - radium <= Y2
                        && y + radium >= Y1
                    ) ? id : null
                )),
                []
            ).filter(Boolean);
            return {
                selectedIds: idsInRange.length === 0
                    ? []
                    : selectedIds.concat(idsInRange.filter(
                        id => !selectedIds.includes(id)
                    ))
            };
        })
    };

    onRowClick = (circles, selected) => {
        this.setState(({selectedIds}) => {
            const ids = circles.map(({id}) => id);
            return {
                selectedIds: selected
                    ? selectedIds.filter(id => !ids.includes(id))
                    : selectedIds.concat(ids)
            }
        })
    };


    render() {
        const {
            generateDialogOpen,
            rows,
            viewBox,
            selectedIds,
            history,
            radium
        } = this.state;
        const styles = {
            container: {
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            },
            actionBar: {
                height: 100,
                padding: 10,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
            },
            actionGroup: {
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                padding: '0',
                margin: '0 10px',
                borderLeft: '1px solid #ddd',
                flexWrap: 'wrap',
                position: 'relative',
            },
            actionGroupLabel: {
                textAlign: 'center',
                fontSize: '.8rem',
                top: -5,
                left: 0,
                right: 0,
                position: 'absolute',
                color: '#999'
            },
            actionButton: {
                margin: '0 5px',
            },
            separator: {
                height: '100%',
                width: 1,
                background: '#ddd'
            },
            svg: {
                width: '100%',
                height: 0,
                flexGrow: 1,
                border: '1px solid #ddd',
                display: 'block'
            }
        };

        return (
            <div style={styles.container}>
                <div style={styles.actionBar}>
                    <IconButton
                        style={styles.actionButton}
                        icon={<Generate/>}
                        onClick={() => this.setState({generateDialogOpen: true})}
                        label="Generar"
                    />
                    <IconButton
                        style={styles.actionButton}
                        icon={<Undo/>}
                        onClick={this.undo}
                        label="Deshacer"
                        disabled={history.length === 0}
                    />
                    <div style={styles.actionGroup}>
                        <IconButton
                            style={styles.actionButton}
                            icon={<Delete/>}
                            onClick={this.onDelete}
                            label="Eliminar"
                            disabled={selectedIds.length === 0}
                        />
                        <IconButton
                            style={styles.actionButton}
                            icon={<Text/>}
                            onClick={this.onRowChange}
                            label="Cambiar fila"
                            disabled={selectedIds.length === 0}
                        />
                        <IconButton
                            style={styles.actionButton}
                            icon={<Text/>}
                            onClick={this.onColChange}
                            label="Cambiar columna"
                            disabled={selectedIds.length === 0}
                        />
                        <div style={styles.actionGroupLabel}>
                            {`Asiento${selectedIds.length > 1 ? 's' : ''}`}
                        </div>
                    </div>
                </div>
                <Selector onSelect={this.onMultiSelect}>
                    <svg style={styles.svg} viewBox={viewBox} ref={svg => this.svg = svg}>
                        {rows.map(({index, y, name, circles}) => {
                            const selected = circles.every(({id}) => selectedIds.includes(id));
                            return (
                                <React.Fragment key={index}>
                                    <text
                                        x={LETTERS_SPACE / 2}
                                        y={y}
                                        onMouseDown={e => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onClick={() => this.onRowClick(circles, selected)}
                                        style={{
                                            fontSize: radium,
                                            textAnchor: 'middle',
                                            dominantBaseline: 'central',
                                            cursor: 'pointer',
                                            fill: selected && green,
                                        }}
                                        fontFamily="Proxima Nova"
                                    >
                                        {name}
                                    </text>
                                    {circles.map(circle => {
                                        const selected = selectedIds.includes(circle.id);
                                        return (
                                            <Seat
                                                key={circle.id}
                                                seat={circle}
                                                radium={radium}
                                                onClick={e => this.onSeatClick(circle.id, selected)}
                                                selected={selected}
                                            />
                                        )
                                    })}
                                </React.Fragment>
                            )
                        })}
                    </svg>
                </Selector>

                <GenerateSectionDialog
                    open={generateDialogOpen}
                    onClose={() => this.setState({generateDialogOpen: false})}
                    onSuccess={this.generate}
                />
            </div>
        )
    }
}

const Seat = ({seat, radium, selected, ...props}) => {
    const {row, col, x, y} = seat;
    const code = `${row}-${col}`;
    const styles = {
        circle: {
            cursor: 'pointer',
            fill: '#444',
            stroke: green,
            strokeWidth: selected ? 5 : 0,
            transition: 'all 50ms'
        },
        label: {
            fill: 'white',
            fontSize: radium / 2,
            lineHeight: radium / 2,
            fontFamily: 'Proxima Nova',
            pointerEvents: 'none',
            textAnchor: 'middle',
            dominantBaseline: 'central'
        }
    };
    return (
        <React.Fragment key={code}>
            <circle
                {...props}
                id={code}
                cx={x}
                cy={y}
                r={radium}
                style={styles.circle}
                onMouseDown={e => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
            />
            <text
                x={x}
                y={y}
                style={styles.label}
            >
                {code}
            </text>
        </React.Fragment>
    )
};

Seat.propTypes = {
    seat: seatType.isRequired,
    radium: PropTypes.number,
    selected: PropTypes.bool
};

const IconButton = Radium(({icon, label, style, onClick, disabled}) => {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'all 100ms',
            cursor: 'pointer',
            border: '0',
            padding: 5,
            width: 60,
            height: 60,
            borderRadius: 3,
            fill: '#555',
            color: '#555',
            ':hover': {
                background: 'rgba(0,0,0,.05)'
            },
            ...style,
            ...(disabled && {
                opacity: .5,
                pointerEvents: 'none'
            })
        },
        label: {
            fontSize: '.8rem',
        }
    };

    return (
        <button
            onClick={disabled ? undefined : onClick}
            style={styles.container}
        >
            {icon}
            <div style={styles.label}>
                {label}
            </div>
        </button>
    )
});