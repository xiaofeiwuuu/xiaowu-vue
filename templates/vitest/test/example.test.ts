import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Home from '../src/views/Home.vue'

describe('Home', () => {
  it('renders properly', () => {
    const wrapper = mount(Home)
    expect(wrapper.text()).toContain('首页')
  })
}) 