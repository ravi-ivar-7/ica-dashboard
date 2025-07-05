
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
      return 'bg-yellow-500';
    case 'success':
      return 'bg-green-500';
    case 'error':
      return 'bg-red-500';
    default:
      return 'bg-gray-400';
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'text':
      return 'bg-blue-500';
    case 'image':
      return 'bg-purple-500';
    case 'video':
      return 'bg-red-500';
    case 'audio':
      return 'bg-green-500';
    case 'number':
      return 'bg-orange-500';
    case 'boolean':
      return 'bg-pink-500';
    case 'any':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};