import { animated, useSpring } from '@react-spring/web'

const AddRotate = ({ isClose, className, children }) => {
  const styles = useSpring({
    transform: isClose ? 'rotate(45deg)' : 'rotate(0deg)',
    background: isClose ? '#F03D3E' : '#7048E8',
    config: {
      duration: 180
    }
  });

  const style = `
    overflow-hidden
    rounded-full
    bg-purple
    flex
    group
    h-50
    items-center
    justify-center
    w-50
    ${className}
  `;

  return <animated.div style={styles} className={style}>{children}</animated.div>
}

export default AddRotate

