import styles from 'ansi-styles'

const colors = ['red', 'yellow', 'green']

export function coloredConsole (console) {
  const colorConsole = {
    ...console
  }
  colors.forEach(color => {
    colorConsole[color] = function () {
      console.log(styles.color[color].open, ...arguments, styles.color[color].close)
    }
  })
  return colorConsole
}
