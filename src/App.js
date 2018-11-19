import React, { Component } from 'react'
import posed, { PoseGroup } from 'react-pose'
import './App.css'
import shuffle from './helpers/shuffle'

const ListItem = posed.li({
  // draggable: 'y',
  // init: { scale: 1 },
  // drag: { scale: 1.2 }
})

class App extends Component {
  state = {
    list: [
      { color: 'paleturquoise' },
      { color: 'aquamarine' },
      { color: 'turquoise' },
      { color: 'lightseagreen' },
      { color: 'skyblue' },
      { color: 'lightslategrey' },
      { color: 'steelblue' },
      { color: 'mediumpurple' }
    ],
    draggingBox: null
  }

  shuffleBoxes = () => {
    this.setState(({ list }) => ({ list: shuffle(list) }))
  }

  dragStart = color => {
    let index
    this.state.list.forEach((li, i) => {
      if (li.color === color) index = i
    })
    this.setState(({ list, draggingBox }) => {
      return {
        draggingBox: { color, index },
        list: list.map(c => (c.color === color ? { color: '' } : c))
      }
    })
  }

  handleDrop = () => {
    this.setState(({ list, draggingBox }) => ({
      draggingBox: null,
      list: list.map(li => (li.dropZone ? { color: draggingBox.color } : li))
    }))
  }

  spliceAfter = c => {
    const { list } = this.state
    let indexOfC
    list.forEach(({ color }, i) => {
      if (color === c) indexOfC = i
    })
    let newList = [...list].filter(({ color }) => color !== '')
    newList.splice(indexOfC, 0, { color: '', dropZone: true })
    this.setState({ list: newList })
  }

  render() {
    const {
      state: { list },
      shuffleBoxes,
      spliceAfter,
      dragStart,
      handleDrop
    } = this
    return (
      <div className="App">
        <div className="button-container">
          <button className="btn" onClick={shuffleBoxes}>
            shuffle
          </button>
        </div>
        <div className="list-container">
          <ul>
            <PoseGroup>
              {list.map(({ color, dropZone }) => (
                <ListItem
                  key={color}
                  draggable
                  onDrag={() => dragStart(color)}
                  onDragEnter={e => spliceAfter(color)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    if (dropZone) handleDrop()
                  }}>
                  <div className="listInner" style={{ background: color }} />
                </ListItem>
              ))}
            </PoseGroup>
          </ul>
        </div>
      </div>
    )
  }
}

export default App
