function useSmoothScroll() {
  return (event) => {
    const href = event.currentTarget.getAttribute('href')

    if (!href?.startsWith('#')) {
      return
    }

    const target = document.querySelector(href)
    if (!target) {
      return
    }

    event.preventDefault()
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default useSmoothScroll
