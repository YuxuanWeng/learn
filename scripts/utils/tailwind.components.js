module.exports = {
  '.region-none': {
    '-webkit-app-region': 'none'
  },
  '.region-drag': {
    '-webkit-app-region': 'drag'
  },
  '.flex-center': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  '.inline-flex-center': {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  '.absolute-full': {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  '.fixed-full': {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  '.truncate-clip': {
    'text-overflow': 'clip',
    overflow: 'hidden',
    'white-space': 'nowrap'
  },
  '.overflow-overlay': {
    overflow: 'hidden',
    '&:hover': {
      overflow: 'overlay'
    }
  },
  '.overflow-x-overlay': {
    'overflow-x': 'hidden',
    '&:hover': {
      'overflow-x': 'overlay'
    }
  },
  '.overflow-y-overlay': {
    'overflow-y': 'hidden',
    '&:hover': {
      'overflow-y': 'overlay'
    }
  },
  '.border-xs': {
    'border-width': '0.5px'
  },
  '.rounded-px': {
    'border-radius': '1px'
  },
  '.scrollbar-stable': {
    'scrollbar-gutter': 'stable'
  }
};
