import React from 'react'
import './schedule.css'
import Media from "react-media"
import Arrow from 'react-icons/lib/fa/angle-double-down'
import { CSSTransitionGroup } from 'react-transition-group'
import moment from 'moment';
import ReactHTMLParser from 'react-html-parser';
import { withPrefix } from 'gatsby-link'

export default class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.Items = [];
        let categories = new Set();
        categories.add("All")
        props.data.allMarkdownRemark.edges.forEach((value) => {
            let item = value.node.frontmatter;
            item.start = moment(item.start);
            item.end = moment(item.end);
            item.html = value.node.html;
            this.Items.push(item);
            categories.add(item.category);
        });
        this.categories = Array.from(categories.values());
        this.state = {
            filter: "All",
            items: this.Items,
            detailIndex: 0
        }
    }
    shouldComponentUpdate(nextProps, nextState){
        return !(this.state.detailIndex == nextState.detailIndex && this.state.filter == nextState.filter);
    }
    switchDetailIndex(i) {
        if(typeof i !== `undefined`){
             this.setState({
                detailIndex: i
            });
        }
    }
    switchActiveSet(i) {
        if(i) {
            let array = this.Items.filter((t) => {return i === `All` || t.category === i});
            this.setState({
                filter: i,
                items: array,
                detailIndex: 0
            })
        }
    }
    render() {
        return (
            <div className="schedule-grid-container">
                <div className="list-component">
                    <nav className="nav nav-pills">
                        {this.categories.map(i => {
                            return (
                                <NavPillItem handler={this.switchActiveSet.bind(this)} key={i} text={i} filter={this.state.filter} />
                            );
                        })}
                    </nav>
                    <div className="card-group list-container">
                        <dt>Jan 20</dt>
                        {this.state.items.map((v, i) => {
                            if(v.start.date() == 20) return (<ScheduleItem className={v.category} active={this.state.detailIndex == i} key={i} index={i} handler={this.switchDetailIndex.bind(this)} item={v}/>)
                        })}
                        <dt>Jan 21</dt>
                        {this.state.items.map((v, i) => {
                            if(v.start.date() == 21) return (<ScheduleItem className={v.category} active={this.state.detailIndex == i} key={i} index={i} handler={this.switchDetailIndex.bind(this)} item={v}/>)
                        })}
                    </div>
                </div>
                <Media query={{minWidth: 992}}
                render={() => {
                    return (
                        <div className="detail-component">
                            <Detail start={this.state.items[this.state.detailIndex].start} end={this.state.items[this.state.detailIndex].end} title={this.state.items[this.state.detailIndex].title}
                            description={this.state.items[this.state.detailIndex].html}/>
                        </div>
                    );
                }}
                />

            </div>
        )
    }
}
const NavPillItem = (props) => {
    function handle(){
        props.handler(props.text);
    }
    return (
        <div className="nav-item" onClick={handle}>
            <button className={ "btn btn-outline-primary" + (props.filter === props.text ? " active" : "")}>
                {props.text}
            </button>
        </div>
    )
}
class ScheduleItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        }
    }
    handle() {
        this.props.handler(this.props.index);
        this.setState({
            expanded: !this.state.expanded
        })
    }
    componentWillReceiveProps(nextProps){
        if(this.props.active == true && nextProps.active == false) this.setState({expanded: false});
    }
    render() {
        let start = this.props.item.start;
        let end = this.props.item.end;
        return(
            <CSSTransitionGroup
                transitionName="fade"
                transitionEnterTimeout={800}
                transitionLeaveTimeout={300}
            >
                <div className={ "card list-card " + this.props.className} onClick={this.handle.bind(this)}>
                    <div className="card-body list-body">
                        <div className="card-left">
                            <h4 className="card-title content">{this.props.item.title}</h4>
                        </div>
                        <div className="card-right">
                            <p className="content">{start.format("hh:mm A")} - {end.format("hh:mm A")}</p>
                        </div>

                    </div>
                    <Media query={{maxWidth: 992}}
                        render={() => {
                            return (<div style={{textAlign:"center"}}><Arrow height="1.5em" width="1.5em"/></div>)
                        }} />
                </div>
                {
                    this.state.expanded ? <Media query={{maxWidth: 992}}
                        render={() => {
                            return (<Detail start={start}
                                end={end}
                                title={this.props.item.title}
                                description={this.props.item.html}/>);
                        }}
                    /> : null
                }
            </CSSTransitionGroup>
        );
    }
}
const Detail = (props) => (
    <div id="description" className="card">
        <div className="card-body">
            <h1 className="card-title">{props.title}</h1>
            <h3 className="card-subtitle mb-2 text-muted">{props.start.format("Do MMM hh:mm A") + " - " + props.end.format("Do MMM hh:mm A")}</h3>
            <div>{ReactHTMLParser(props.description, {transform: (node) => {
                if(node.type === 'tag' && node.name === 'img') {
                    return <img alt={node.attribs.alt} title={node.attribs.title} src={withPrefix(node.attribs.src)}/>;
                }
            }})}</div>
        </div>
    </div>
)
