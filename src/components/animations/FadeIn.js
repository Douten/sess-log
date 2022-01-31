import { animated, useSpring } from '@react-spring/web'

const FadeIn = ({ isVisible, className, children }) => {
  const styles = useSpring({
    // display: isVisible ? 'block' : 'none',
    opacity: isVisible ? 1 : .8,
    y: isVisible ? 0 : -100,
    maxHeight: isVisible ? '320px' : '0',
    // background: isVisible ? 'rgb(255 255 255 / 0.1)' : 'rgb(255 255 255 / 0.8)',
    config: {
      duration: 200
    }
  });

  const style = `overflow-hidden ${className}`;

  return <animated.div style={styles} className={style}>{children}</animated.div>
}

export default FadeIn

