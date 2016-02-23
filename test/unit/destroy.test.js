/** @jsx etch.dom */

import etch from '../../src/index'

describe('etch.destroy(component)', () => {
  it('removes the component\'s element from the document and calls `destroy` on child components', async () => {
    class ParentComponent {
      constructor () {
        this.destroyCallCount = 0
        etch.initialize(this)
      }

      render () {
        return (
          <div>
            <div>
              <ChildComponent ref='child' />
            </div>
          </div>
        )
      }

      destroy () {
        etch.destroy(this)
        this.destroyCallCount++
      }
    }

    class ChildComponent {
      constructor () {
        this.destroyCallCount = 0
        etch.initialize(this)
      }

      render () {
        return <div>child</div>
      }

      destroy () {
        etch.destroy(this)
        this.destroyCallCount++
      }
    }

    let parent = new ParentComponent()
    let child = parent.refs.child
    let container = document.createElement('div')
    container.appendChild(parent.element)

    await etch.destroy(parent)

    expect(parent.destroyCallCount).to.equal(0) // We don't call `destroy` on the component itself
    expect(child.destroyCallCount).to.equal(1) // But we do call it on child components
    expect(parent.element.parentElement).to.be.null
    expect(child.element.parentElement).not.to.be.null // Only removes the root node to avoid unnecessary DOM writes
  })
})
