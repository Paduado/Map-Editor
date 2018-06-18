import * as React from 'react'
import PropTypes from 'prop-types'
import {seatType} from "../utils/types";
import {green, lightBlue} from "../utils/colors";
import Selector from "./Selector";
import GenerateSectionDialog from "./GenerateSectionDialog";
import {AlignCenter, AlignLeft, AlignRight, Delete, DeleteRow, Download, Generate, Text, Undo} from "./svgs";
import PromptDialog from "./PromptDialog";
import ActionBar, {ActionButton} from "./ActionBar";
import {getSvgHtml} from "../utils/svgScripts";

const getCodeLabel = (offset, startLabel, order) => {
    if(order === 'desc')
        offset *= -1;
    if(!isNaN(Number(startLabel)))
        return Number(startLabel) + offset;

    return startLabel.replace(
        /.$/,
        c => String.fromCharCode(c.charCodeAt(0) + offset)
    );
};

export const LETTERS_SPACE = 50;
export const FIELD_SPACE = 100;
const CIRCLE_WIDTH = .7;

const isRowSelected = (row, selectedIds) => row.cols.length > 0 && row.cols.every(
    ({id}) => selectedIds.includes(id)
);

const getLayoutData = rows => {
    const rowsAmount = rows.length;
    const colsAmount = Math.max(
        ...rows.map(({cols}) => cols.length)
    );
    const step = 1000 / Math.max(rowsAmount, colsAmount);
    const colsEnd = Math.min(colsAmount / rowsAmount, 1) * 1000 + LETTERS_SPACE;
    const rowsEnd = Math.min(rowsAmount / colsAmount, 1) * 1000 + FIELD_SPACE;
    const radium = step / 2 * CIRCLE_WIDTH;
    return {
        viewBox: `0 0 ${colsEnd} ${rowsEnd}`,
        step,
        radium
    };
};


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
        rowChangeDialogOpen: false,
        colChangeDialogOpen: false,
        saveDialogOpen: false,
        history: []
    };

    svg = React.createRef();
    a = document.createElement('a');

    componentDidMount() {
        window.addEventListener('keypress', this.onKeyPress);
        this.a.style.display = 'none';
        document.body.appendChild(this.a);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.onKeyPress);
        document.body.removeChild(this.a);
    }

    componentDidUpdate(prevProps, prevState) {
        const {rows, viewBox, isUndo} = this.state;
        if(
            rows !== prevState.rows
            || viewBox !== prevState.viewBox
        ) {
            if(isUndo)
                this.setState({isUndo: false});
            else
                this.setState(({history}) => ({
                    history: [...history, {
                        rows: prevState.rows,
                        viewBox: prevState.viewBox,
                    }]
                }));
        }
    }

    onKeyPress = ({key, ctrlKey}) => {
        if(key === 'z' && ctrlKey)
            this.undo()
    };

    undo = () => {
        this.setState(({history}) => {
            if(!history.length)
                return null;

            const [{rows, viewBox}] = history.slice(-1);
            return {
                rows,
                viewBox,
                history: history.slice(0, -1),
                isUndo: true
            }
        });
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
        const rowsArr = Array.from(
            {length: rowsAmount},
            (_, row) => getCodeLabel(row, rowsStart, rowsOrder)
        );
        const colsArr = Array.from(
            {length: colsAmount},
            (_, col) => getCodeLabel(col, colsStart, colsOrder)
        );
        const rows = rowsArr.map((row, i) => ({
            name: row,
            x: LETTERS_SPACE / 2,
            cols: colsArr.map((col, j) => ({
                id: `${i}-${j}`,
                index: j,
                row,
                col,
            }))
        }));
        const {step, radium, viewBox} = getLayoutData(rows);

        this.setState({
            generateDialogOpen: false,
            viewBox,
            rows: rows.map((row, i) => ({
                ...row,
                y: step * (i + .5),
                x: LETTERS_SPACE / 2,
                size: radium,
                cols: row.cols.map(col => ({
                    ...col,
                    radium,
                    y: step * (i + .5),
                    x: step * (col.index + .5) + LETTERS_SPACE,
                }))
            })),
        });
    };


    onSeatClick = (id, selected) => {
        this.setState(({selectedIds}) => ({
            selectedIds: selected
                ? selectedIds.filter(ID => ID !== id)
                : selectedIds.concat(id)
        }))
    };

    onRowChange = rowName => {
        this.setState(({selectedIds, rows}) => ({
            rowChangeDialogOpen: false,
            rows: rows.map(row => ({
                ...row,
                ...(isRowSelected(row, selectedIds) && {
                    name: rowName
                }),
                cols: row.cols.map(col => ({
                    ...col,
                    ...(selectedIds.includes(col.id) && {
                        row: rowName
                    })
                }))
            }))
        }));
    };

    onColChange = colName => {
        this.setState(({selectedIds, rows}) => ({
            colChangeDialogOpen: false,
            rows: rows.map(row => ({
                ...row,
                cols: row.cols.map(col => ({
                    ...col,
                    ...(selectedIds.includes(col.id) && {
                        col: colName
                    })
                }))
            }))
        }));
    };

    onDelete = () => this.setState(({selectedIds, rows}) => {
        rows = rows.map(row => ({
            ...row,
            cols: row.cols.filter(
                ({id}) => !selectedIds.includes(id)
            )
        }));
        const minColIndex = Math.ceil(Math.min(
            ...rows.map(({cols}) => Math.min(
                ...cols.map(({index}) => index))
            )
        ));
        const {step, radium, viewBox} = getLayoutData(rows);
        return {
            rows: rows.map((row, i) => ({
                ...row,
                size: radium,
                y: step * (i + .5),
                cols: row.cols.map(col => ({
                    ...col,
                    radium,
                    index: col.index - minColIndex,
                    y: step * (i + .5),
                    x: step * (col.index - minColIndex + .5) + LETTERS_SPACE,
                }))
            })),
            viewBox,
            selectedIds: []
        }
    });

    onMultiSelect = ({x1, x2, y1, y2}) => {
        const point = this.svg.current.createSVGPoint();
        point.x = x1;
        point.y = y1;
        const {x: X1, y: Y1} = point.matrixTransform(this.svg.current.getScreenCTM().inverse());
        point.x = x2;
        point.y = y2;
        const {x: X2, y: Y2} = point.matrixTransform(this.svg.current.getScreenCTM().inverse());

        const getDistance = (dx, dy) => (
            Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2)
        );

        this.setState(({selectedIds, rows}) => {
            const idsInRange = rows.reduce((cols, row) =>
                cols.concat(row.cols.filter(
                    ({x, y, radium}) =>
                        getDistance(X1 - x, Y1 - y) <= radium
                        && getDistance(x - X2, Y1 - y) <= radium
                        && getDistance(X1 - x, y - Y2) <= radium
                        && getDistance(x - X2, y - Y2) <= radium
                    )
                ), []
            ).map(({id}) => id);

            return {
                selectedIds: idsInRange.length === 0
                    ? []
                    : [...new Set([...selectedIds, ...idsInRange])]
            };
        })
    };

    onRowClick = (row, selected) => {
        this.setState(({selectedIds}) => {
            const ids = row.cols.map(({id}) => id);
            return {
                selectedIds: selected
                    ? selectedIds.filter(id => !ids.includes(id))
                    : [...new Set(selectedIds.concat(ids))]
            }
        })
    };

    onRowDelete = () => {
        this.setState(({rows, selectedIds}) => {
            rows = rows.filter(
                row => !isRowSelected(row, selectedIds)
            );
            const {step, viewBox, radium} = getLayoutData(rows);
            return {
                viewBox,
                rows: rows.map((row, i) => ({
                    ...row,
                    radium,
                    y: step * (i + .5),
                    cols: row.cols.map(col => ({
                        ...col,
                        radium,
                        y: step * (i + .5),
                        x: step * (col.index + .5) + LETTERS_SPACE,
                    }))
                }))
            }
        })
    };

    onRowLeftAlign = () => {
        this.setState(({rows, selectedIds}) => {
            const {step} = getLayoutData(rows);
            return ({
                rows: rows.map(row => !isRowSelected(row, selectedIds) ? row : {
                    ...row,
                    cols: row.cols.map((col, i) => ({
                        ...col,
                        x: step * (i + .5) + LETTERS_SPACE,
                        index: i
                    }))
                })
            })
        })
    };

    onRowRightAlign = () => {
        this.setState(({rows, selectedIds}) => {
            const {step} = getLayoutData(rows);
            const maxLength = Math.max(
                ...rows.map(
                    ({cols}) => Math.max(cols.length)
                )
            ) - 1;
            return ({
                rows: rows.map(row =>
                    !isRowSelected(row, selectedIds)
                        ? row
                        : {
                            ...row,
                            cols: row.cols.reverse().map((col, i) => ({
                                ...col,
                                x: step * (maxLength - i + .5) + LETTERS_SPACE,
                                index: maxLength - i
                            })).reverse()
                        }
                )
            })
        })
    };

    onRowCenter = () => {
        this.setState(({rows, selectedIds}) => {
            const {step} = getLayoutData(rows);
            const maxLength = Math.max(
                ...rows.map(
                    ({cols}) => Math.max(cols.length)
                )
            );
            return ({
                rows: rows.map(row =>
                    !isRowSelected(row, selectedIds)
                        ? row
                        : {
                            ...row,
                            cols: row.cols.map((col, i, {length}) => {
                                const offset = (maxLength - length) / 2;
                                return {
                                    ...col,
                                    x: step * (i + offset + .5) + LETTERS_SPACE,
                                    index: i + offset
                                }
                            })
                        }
                )
            })
        })
    };

    download = fileName => {
        const {viewBox, rows} = this.state;
        const data = new Blob(
            [getSvgHtml({viewBox, rows})],
            {type: 'image/svg+xml'}
        );
        this.a.href = URL.createObjectURL(data);
        this.a.download = fileName;
        this.a.click();
        this.setState({saveDialogOpen: false});
    };

    render() {
        const {
            generateDialogOpen,
            rows,
            selectedIds,
            history,
            viewBox,
            rowChangeDialogOpen,
            colChangeDialogOpen,
            saveDialogOpen,
        } = this.state;

        const [left, top, width, height] = viewBox.split(' ');

        const isNoRowSelected = !rows.some(
            row => isRowSelected(row, selectedIds)
        );
        const styles = {
            container: {
                width: '100%',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: lightBlue
            },
            actionBar: {
                height: 80,
                padding: 10,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
            },
            separator: {
                height: '100%',
                width: 1,
                background: '#ddd',
                margin: '0 10px'
            },
            svgContainer: {
                height: 0,
                width: '100%',
                flexGrow: 1,
                alignSelf: 'center'
            },
            svg: {
                border: '1px solid #ddd',
                height: '100%',
                display: 'block',
                margin: '0 auto',
                background: 'white',
                maxWidth: '100%'
            },
            field:{
                fontSize:FIELD_SPACE / 3,
                pointerEvents: 'none',
                textAnchor: 'middle',
                dominantBaseline: 'central',
                fontFamily:'Proxima Nova'
            }
        };

        return (
            <div style={styles.container}>
                <ActionBar>
                    <ActionButton
                        icon={<Generate/>}
                        onClick={() => this.setState({generateDialogOpen: true})}
                        label="Generar"
                    />
                    <ActionButton
                        icon={<Undo/>}
                        onClick={this.undo}
                        label="Deshacer"
                        disabled={history.length === 0}
                    />
                    <div style={styles.separator}/>
                    <ActionButton
                        icon={<Delete/>}
                        onClick={this.onDelete}
                        label={`Eliminar asiento${selectedIds.length > 1 ? 's' : ''}`}
                        disabled={selectedIds.length === 0}
                    />
                    <ActionButton
                        icon={<Text/>}
                        onClick={() => this.setState({colChangeDialogOpen: true})}
                        label="Cambiar columna"
                        disabled={selectedIds.length === 0}
                    />
                    <div style={styles.separator}/>
                    <ActionButton
                        icon={<Text/>}
                        onClick={() => this.setState({rowChangeDialogOpen: true})}
                        label="Cambiar fila"
                        disabled={isNoRowSelected}
                    />
                    <ActionButton
                        icon={<DeleteRow/>}
                        onClick={this.onRowDelete}
                        label="Eliminar fila"
                        disabled={isNoRowSelected}
                    />
                    <div style={styles.separator}/>
                    <ActionButton
                        icon={<AlignLeft/>}
                        onClick={this.onRowLeftAlign}
                        label="Alinear izquierda"
                        disabled={isNoRowSelected}
                    />
                    <ActionButton
                        icon={<AlignCenter/>}
                        onClick={this.onRowCenter}
                        label="Alinear centro"
                        disabled={isNoRowSelected}
                    />
                    <ActionButton
                        icon={<AlignRight/>}
                        onClick={this.onRowRightAlign}
                        label="Alinear derecha"
                        disabled={isNoRowSelected}
                    />
                    <div style={styles.separator}/>
                    <ActionButton
                        icon={<Download/>}
                        onClick={() => this.setState({saveDialogOpen: true})}
                        label="Descargar"
                        background={green}
                        color="white"
                        disabled={!rows.some(({cols}) => cols.length > 0)}
                    />
                </ActionBar>
                <div style={styles.svgContainer}>
                    <Selector onSelect={this.onMultiSelect}>
                        <svg
                            style={styles.svg}
                            viewBox={viewBox}
                            ref={this.svg}
                        >
                            {rows.map((row, i) => {
                                const selected = isRowSelected(row, selectedIds);
                                return (
                                    <React.Fragment key={i}>
                                        <RowLabel
                                            y={row.y}
                                            x={row.x}
                                            onClick={() => this.onRowClick(row, selected)}
                                            children={row.name}
                                            size={row.size}
                                            selected={selected}
                                        />
                                        {row.cols.map(circle => {
                                            const selected = selectedIds.includes(circle.id);
                                            return (
                                                <Seat
                                                    key={circle.id}
                                                    seat={circle}
                                                    onClick={() => this.onSeatClick(circle.id, selected)}
                                                    selected={selected}
                                                />
                                            )
                                        })}
                                    </React.Fragment>
                                )
                            })}
                            <text
                                y={height - top - FIELD_SPACE / 2}
                                x={(width - left) / 2 + LETTERS_SPACE / 2}
                                style={styles.field}
                            >
                                CAMPO
                            </text>
                        </svg>
                    </Selector>
                </div>

                <GenerateSectionDialog
                    open={generateDialogOpen}
                    onClose={() => this.setState({generateDialogOpen: false})}
                    onSuccess={this.generate}
                />
                <PromptDialog
                    open={rowChangeDialogOpen}
                    onClose={() => this.setState({rowChangeDialogOpen: false})}
                    onSuccess={row => this.onRowChange(row)}
                    title="Ingresa el valor de la fila"
                    inputLabel="Fila"
                />
                <PromptDialog
                    open={colChangeDialogOpen}
                    onClose={() => this.setState({colChangeDialogOpen: false})}
                    onSuccess={col => this.onColChange(col)}
                    title="Ingresa el valor de la columna"
                    inputLabel="Columna"
                />
                <PromptDialog
                    open={saveDialogOpen}
                    onClose={() => this.setState({saveDialogOpen: false})}
                    onSuccess={fileName => this.download(fileName)}
                    title="Descargar sección"
                    defaultValue="seccion"
                    inputLabel="Nombre del archivo"
                />
            </div>
        )
    }
}

function RowLabel({style, size, selected, ...props}) {
    const defaultStyle = {
        fontSize: Math.min(size, LETTERS_SPACE),
        textAnchor: 'middle',
        dominantBaseline: 'central',
        cursor: 'pointer',
        fill: selected && green,
        fontFamily: 'Proxima Nova',
        ...style
    };
    return (
        <text
            {...props}
            style={defaultStyle}
            onMouseDown={e => {
                e.preventDefault();
                e.stopPropagation();
            }}
        />
    )
}

RowLabel.propTypes = {
    y: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

function Seat({seat, selected, ...props}) {
    const {row, col, x, y, radium} = seat;
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
}

Seat.propTypes = {
    seat: seatType.isRequired,
    selected: PropTypes.bool
};

