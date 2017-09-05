import React, { Component } from 'react'
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts'
import ReactDataSheet from 'react-datasheet'
// Be sure to include styles at some point, probably during your bootstrapping 
import 'react-datasheet/lib/react-datasheet.css'
import _ from 'lodash'
import './App.css'

/**
 * 本组件为欢迎页（首页）
 * 由于几乎没有交互逻辑
 * 因此可以不使用类的写法
 * 
 * 实际上，ES6 的类经由 Babel 转码后
 * 其实还是返回一个类似的函数
 */


export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      grocery: [],
      items: 3,
      grid: [
        [{readOnly: true, colSpan: 3, value: '兜金乐'}],
        [{readOnly: true, value: ''}, 
         { 
          value: '日期', 
          component: (
            <div className={'add-grocery'}> 日期 
              <div className={'add-button'} onClick={this.addNewRow.bind(this)}> add item</div>
            </div>
          ), 
          forceComponent: true
        },
        { 
          value: '收益', 
          component: (
            <div className={'add-grocery'}> 收益 
              <div className={'add-button'} onClick={this.removeNewRow.bind(this)}> remove item</div> 
            </div>
          ), 
          forceComponent: true
        }]
      ],
      total: 0
    }
  }

  addNewRow () {
    let length = (this.state.grocery.length + 1)
    
    let arrayGrocery = this.state.grocery
    arrayGrocery.push({id: length, date: '', profit: ''})
    this.setState({
      grocery: arrayGrocery
    })
    let array = [{readOnly: true, value: length}, {value: this.groceryValue(length), component: this.customerComponent(length)}, {value: this.profitValue(length), component: this.customerProfitComponent(length)}]
    this.state.grid.push(array)
  }

  removeNewRow () {
    let length = this.state.grid.length

    if (length > 2) {
      let arrayGrocery = this.state.grocery
      arrayGrocery.length = arrayGrocery.length - 1
      this.setState({
        grocery: arrayGrocery
      })
      this.state.grid.length = this.state.grid.length - 1
    }
  }

  groceryValue (id) {
    let idVal = ''
    for (var i = 0; i < this.state.grocery.length; i++) {
      if (this.state.grocery[i].id === id) {
        idVal = `${this.state.grocery[i].date}`
      }
    }
    return idVal || ''
  }

  profitValue (id) {
    let idVal = ''
    for (var i = 0; i < this.state.grocery.length; i++) {
      if (this.state.grocery[i].id === id) {
        idVal = `${this.state.grocery[i].profit}`
      }
    }
    return idVal || ''
  }


  handleInputChange (id, evt) {
    let val = evt.target.value
    let array = this.state.grocery
    let number = 0
    for (var i = 0; i < this.state.grocery.length; i++) {
      if (this.state.grocery[i].id === id) {
        array[i].date = val
        number = i
      }
    }

    let arrayGrid = this.state.grid

    arrayGrid[number + 2][1].value = val
    this.setState({grid: arrayGrid})
    this.setState({grocery: array})

  }

  handleInputProfitChange (id, evt) {
    let val = evt.target.value
    let array = this.state.grocery
    let number = 0
    for (var i = 0; i < this.state.grocery.length; i++) {
      if (this.state.grocery[i].id === id) {
        array[i].profit = val
        number = i
      }
    }

    let arrayGrid = this.state.grid

    arrayGrid[number + 2][2].value = val
    this.setState({grid: arrayGrid})
    this.setState({grocery: array})
  }

  customerProfitComponent (id) {
    // let val = JSON.parse(JSON.stringify(this.state.grocery))
    return <input type="number" step="0.0001" onChange={this.handleInputProfitChange.bind(this, id)} />
  }

  customerComponent (id) {
    // let val = this.state && this.state.grocery && this.state.grocery[id - 1] && this.state.grocery[id - 1].date
    return <input type="date" onChange={this.handleInputChange.bind(this, id)} />
  }

  generateGrid () {

    let rows = [
      [{readOnly: true, colSpan: 3, value: 'Shopping List'}],
      [
        {readOnly: true, value: ''}, 
        { 
          value: '日期', 
          component: (
            <div className={'add-grocery'}> 日期 </div>
          ), 
          forceComponent: true
        },
        { 
          value: '收益', 
          component: (
            <div className={'add-grocery'}> 收益 
              <div className={'add-button'} onClick={()=>{console.log('add');this.setState({items: this.state.items + 1})}}> add item</div> 
            </div>
          ), 
          forceComponent: true
        }]
    ]
    rows = rows.concat(_.range(1, this.state.items + 1).map(id => [{readOnly: true, value: `${id}`}, {value: '1'}, {value: '1'}]))

    console.log(rows)
    return rows
  }

  handleExcelChange (modifiedCell, colI, rowJ, value) {
    let array = this.state.grocery
    let arrayGrid = this.state.grid
    if (rowJ === 1) {
      arrayGrid[colI][1].value = value
      this.setState({grid: arrayGrid})
      array[colI - 2].date = value
      this.setState({grocery: array})
    } else if (rowJ === 2) {
      arrayGrid[colI][2].value = value
      this.setState({grid: arrayGrid})
      array[colI - 2].profit = value
      this.setState({grocery: array})
    }
  }

  handlePaste (array, e) {
    // console.log(array)
  }

  handleContextMenu (event, cell, i, j) {
    console.log(cell)
  }

  componentWillMount () {
    this.setState({
      grocery: [{id: 1, date: '2017-09-04', profit: '0.2'}, {id: 2, date: '2017-09-05', profit: '0.5'}, {id: 3, date: '2017-09-06', profit: '0.8'}]
    })
    let arr = this.state.grid
    arr.push([{readOnly: true, value: 1}, {value: '2017-09-04', component: this.customerComponent.bind(this)(1)}, {value: '0.2', component: this.customerProfitComponent.bind(this)(1)}])
    arr.push([{readOnly: true, value: 2}, {value: '2017-09-05', component: this.customerComponent.bind(this)(2)}, {value: '0.5', component: this.customerProfitComponent.bind(this)(2)}])
    arr.push([{readOnly: true, value: 3}, {value: '2017-09-06', component: this.customerComponent.bind(this)(3)}, {value: '0.8', component: this.customerProfitComponent.bind(this)(3)}])
    this.setState({
      grid: arr
    })

    // let chartData = JSON.parse(JSON.stringify(this.state.grocery))
    let totalVal = 0
    for (var i = this.state.grocery.length - 1; i >= 0; i--) {
      totalVal += Number(parseFloat(this.state.grocery[i]).toFixed(4))
    }
    this.setState({
      total: totalVal
    })
  }

  componentWillReceiveProps (nextProps) {
    const nextgrocery = nextProps.grocery
    if (
      JSON.stringify(nextgrocery) ===
      JSON.stringify(this.props.grocery)
    ) return

    // console.log('update')
    //this.updateMsgList(nextDisplayControl)
  }

  componentDidMount () {
  }

  render () {
    // const data = [
    //   {id: 1, date: '', profit: 0.3}, 
    //   {id: 2, date: '2017-09-14', profit: 0.5}, 
    //   {id: 3, date: '2017-09-02', profit: 0.2}, 
    //   {id: 4, date: '2017-09-22', profit: 0.8}]

    // const data = [
    //   {date: '09.01', profit: 0.12, pv: 0.1, amt: 0.7},
    //   {date: '09.02', profit: 0.22, pv: 0.2, amt: 0.6},
    //   {date: '09.03', profit: 0.42, pv: 0.3, amt: 0.5},
    //   {date: '09.04', profit: 0.44, pv: 0.4, amt: 0.4},
    //   {date: '09.05', profit: 0.54, pv: 0.5, amt: 0.3},
    //   {date: '09.06', profit: 0.51, pv: 0.6, amt: 0.2},
    //   {date: '09.07', profit: 0.41, pv: 0.7, amt: 0.1},
    //   {date: '09.07', profit: 0.60, pv: 0.7, amt: 0.1}
    // ]
    const zerofill = val => val >= 10 ? val : '0' + val
    let chartData = JSON.parse(JSON.stringify(this.state.grocery))
    chartData.map(function(obj) { 
       if (obj.date) {
         let oDate = new Date(obj.date)
         let sMonth = zerofill((oDate.getMonth() + 1))
         let sDay = zerofill(oDate.getDate())
         let sVal = sMonth + '.' + sDay
         obj.date = sVal
       }
       obj.profit = Number(parseFloat(obj.profit).toFixed(4))
       return obj
    })

    let chartTotal = JSON.parse(JSON.stringify(this.state.grocery))
    let nTotal = 0
    chartData.map(function(obj) { 
       if (obj.profit) {
         nTotal += Number(parseFloat(obj.profit).toFixed(4))
       }
       return obj
    })
    chartTotal.total = (nTotal * 100).toFixed(2)

    console.log(this.state.grocery)
    const toPercent = (decimal, fixed = 0) => {
      return `${(decimal * 100).toFixed(fixed)}%`
    }
    return (
      <div className="main-container">
        <ReactDataSheet
          ref="dataSheet"
          data={this.state.grid}
          valueRenderer={(cell) => cell.value}
          onChange={this.handleExcelChange.bind(this)}
          onContextMenu={this.handleContextMenu.bind(this)}
        />
        <div className="clip-container">
        <div className="chart-container">
          <h2 className="income">累计收益：{chartTotal.total}%</h2>
          <AreaChart width={700} height={285} data={chartData}
                margin={{top: 13, right: 30, left: 0, bottom: 0}}>
            <XAxis dataKey="date" tickLine={ false } padding={{ left: 0 }}
               axisLine={ false } tick={{ transform: 'translate(0, 10)', fill: '#fff' }} />
            <YAxis tickFormatter={toPercent} tickLine={ false } tickCount={7}
               axisLine={ false } tick={{ transform: 'translate(-6, 0)', fill: '#fff' }} />
            <CartesianGrid strokeDasharray="3 0" vertical={false} />
            <Tooltip/>
            <Area type='monotone' strokeWidth="7" stroke="#ff9300" dataKey='profit' fill='#ff9300' fillOpacity="0.4" />
          </AreaChart>
        </div>
        </div>
      </div>
    )
  }
}
