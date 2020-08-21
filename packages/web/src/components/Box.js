import styled from 'styled-components'
import {typography, color, space, layout, border, position} from 'styled-system'

const Box = styled('div')(
  layout,
  space,
  color,
  border,
  position,
  typography
)

export default Box;
