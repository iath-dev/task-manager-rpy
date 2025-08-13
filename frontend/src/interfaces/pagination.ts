/**
 * Interfaz genérica para respuestas de API paginadas.
 * @template T El tipo de los elementos en la lista de datos.
 */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
}
