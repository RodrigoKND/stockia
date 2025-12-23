interface VirtualSellerConfig {
  name: string;
  avatarUrl: string;
  personality: string;
  welcomeMessage: string;
  catalogTitle: string;
  catalogDescription: string;
  behavior: 'friendly' | 'professional' | 'enthusiastic' | 'casual';
  phoneNumber: string;
  adaptToUser: boolean;
}

interface VisibleAttributes {
  category: boolean;
  quantity: boolean;
}

export const generateShareableLink = (
  productIds: string[],
  sellerConfig?: VirtualSellerConfig,
  visibleAttributes?: VisibleAttributes
) => {
  const baseUrl = window.location.origin;
  const token = btoa(productIds.join(',')).replace(/=/g, '');
  
  // En producción, aquí se guardaría:
  // - sellerConfig en el backend asociado al token
  // - visibleAttributes para controlar qué campos se muestran
  // El token sería único y persistente por 7 días
  // Los cambios se actualizarían sin cambiar el token
  
  return `${baseUrl}/shared/${token}`;
};

export const decodeShareToken = (token: string): string[] => {
  try {
    return atob(token).split(',');
  } catch {
    return [];
  }
};

// Función que simula obtener la configuración del vendedor desde el backend
export const getSellerConfigByToken = (token: string): VirtualSellerConfig | null => {
  // En producción, esto haría una llamada al backend:
  // const response = await fetch(`/api/shared/${token}/config`);
  // return response.json();
  
  return {
    name: 'Sofia',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    personality: 'Soy una vendedora amigable y experta que conoce cada producto en detalle',
    welcomeMessage: '¡Hola! Bienvenido a nuestra tienda. Estoy aquí para ayudarte a encontrar exactamente lo que buscas.',
    catalogTitle: 'Catálogo de Productos Premium',
    catalogDescription: 'Descubre nuestra selección exclusiva de productos de alta calidad',
    behavior: 'friendly',
    phoneNumber: '+59112345678',
    adaptToUser: true,
  };
};

// Función que simula obtener los atributos visibles desde el backend
export const getVisibleAttributesByToken = (token: string): VisibleAttributes => {
  // En producción:
  // const response = await fetch(`/api/shared/${token}/attributes`);
  // return response.json();
  
  return {
    category: true,
    quantity: true,
  };
};

// Función que simula la actualización de la configuración sin cambiar el token
export const updateSellerConfig = async (
  token: string,
  config: VirtualSellerConfig,
  attributes: VisibleAttributes
): Promise<boolean> => {
  // En producción:
  // const response = await fetch(`/api/shared/${token}/config`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ config, attributes })
  // });
  // return response.ok;
  
  console.log('Actualizando configuración para token:', token, { config, attributes });
  return true;
};

// Función que valida si un token sigue siendo válido (no ha expirado los 7 días)
export const isTokenValid = (token: string): boolean => {
  // En producción:
  // const response = await fetch(`/api/shared/${token}/validate`);
  // return response.ok;
  
  return true;
};