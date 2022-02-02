import { animated, useSpring } from '@react-spring/web'

const FadeIn = ({ isVisible, className, children }) => {
  const styles = useSpring({
    opacity: isVisible ? 1 : .8,
    y: isVisible ? 0 : -100,
    maxHeight: isVisible ? '320px' : '0',
    config: {
      duration: 200
    }
  });

  const style = `overflow-hidden flex-1 ${className}`;

  return <animated.div style={styles} className={style}>{children}</animated.div>
}

export default FadeIn

