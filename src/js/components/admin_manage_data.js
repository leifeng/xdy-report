import React from 'react';
import {connect} from 'react-redux'
import {A_getListAsync,A_addListAsync,A_getAsyncClass,A_delListAsync,A_listIsEdit} from '../actions/actions.js'
import AMUIReact from 'amazeui-react';
const {Button,Icon,Input,List,ListItem,Badge,ButtonToolbar,Table} = AMUIReact;

var EventRow = React.createClass({
    render: function () {
        var item = this.props.item;
        return (
            <tr>
                <td>{item.Id}</td>
                <td>{item.className}</td>
                <td>{item.name}</td>
                <td>{item.url}</td>
                <td>
                    <a className="edit" data-id={item.Id}>编辑</a>&nbsp;
                    <a className="del" data-id={item.Id}>删除</a>
                </td>
            </tr>
        );
    }
});

class ManageData extends React.Component {
    constructor(props) {
        super();
        console.log(props);
        this.state = {
            name: '',
            link: '',
            classid: ''
        }
    }

    componentDidMount() {
        const {A_getListAsync}=this.props;
        A_getListAsync();
        setTimeout(()=> {
            this.setState({classid: this.props.classList[0].Id});
        }, 300);

    }

    render() {
        const {classList,list}=this.props;
        return (
            <div>
                <div className="addList">
                    <form className="am-form" target="_blank">
                        <Input type="text" label="描述" id="doc-ipt-1" placeholder="描述" name="name"
                               value={this.state.name} onChange={(e)=>this.changeHandle(e)}/>
                        <Input type="text" label="地址" id="doc-ipt-2" placeholder="http://" name="link"
                               value={this.state.link} onChange={(e)=>this.changeHandle(e)}/>
                        <Input type="select" label="类别" name="classid" value={this.state.classid}
                               onChange={(e)=>this.changeHandle(e)}>
                            {classList.map((item)=> {
                                return (
                                    <option key={item.Id} value={item.Id}>{item.name}</option>
                                )
                            })}
                        </Input>
                        <ButtonToolbar>
                            <Input type="submit" value="提交" standalone onClick={(e)=>this.handleClick(e)}/>
                            <Input type="reset" value="重置" amStyle="danger" standalone/>
                        </ButtonToolbar>
                    </form>
                </div>
                <Table bordered compact striped>
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>类别</th>
                        <th>描述</th>
                        <th>地址</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody onClick={(e)=>this.bodyClick(e)}>
                    {list.map(function (item) {
                        return (<EventRow key={item.Id} item={item}/>);
                    })}
                    </tbody>
                </Table>
            </div>
        )
    }

    changeHandle(e) {
        var newState = {};
        var target = e.target;
        newState[target.name] = target.value;
        this.setState(newState);
    }

    bodyClick(e) {
        const {A_delListAsync,A_listIsEdit}=this.props;
        const target = e.target;
        if (target.nodeName === 'A') {
            const listId = target.getAttribute('data-id');
            if (target.className === 'del') {
                A_delListAsync(listId);
            }
            if (target.className === 'edit') {
                /////这里功能没完成
                A_listIsEdit(true)
            }
        }
    }

    handleClick(e) {
        e.preventDefault();
        const {A_addListAsync}=this.props;
        const name = this.state.name;
        const link = this.state.link;
        const classid = this.state.classid;
        A_addListAsync(name, classid, link);
    }
}
function mapStateToProps(state) {
    return {
        list: state.listManage.R_getList,
        classList: state.classManage.R_classList,
        isEdit:state.listManage.R_listIsEdit
    }
}
export default connect(
    mapStateToProps,
    {A_getListAsync, A_addListAsync, A_delListAsync,A_listIsEdit}
)(ManageData)