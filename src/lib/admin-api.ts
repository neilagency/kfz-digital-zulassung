import useSWR, { type SWRConfiguration } from 'swr';
import { useSWRConfig } from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

/** Build URL with query params, skipping empty values */
function buildUrl(base: string, params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '' && v !== 'all') sp.set(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

/** SWR cache provider backed by sessionStorage for cross-navigation persistence */
export function sessionStorageProvider() {
  const KEY = 'swr-cache';
  const map = new Map<string, any>(
    typeof window !== 'undefined' && sessionStorage.getItem(KEY)
      ? JSON.parse(sessionStorage.getItem(KEY)!)
      : []
  );

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
      const entries: [string, any][] = [];
      map.forEach((v, k) => { entries.push([k, v]); });
      try { sessionStorage.setItem(KEY, JSON.stringify(entries)); } catch { /* quota */ }
    });
  }

  return map;
}

/** Shared high-performance SWR config */
const HP_CONFIG: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  keepPreviousData: true,
  dedupingInterval: 10_000,
  errorRetryCount: 2,
};

// ─── Pagination response shape ───

interface PaginatedResponse<T> {
  pagination: { page: number; limit: number; total: number; pages: number };
  [key: string]: T[] | any;
}

// ─── Dashboard ───

export interface DashboardData {
  stats: {
    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    pendingOrders: number;
    totalCustomers: number;
    totalBlogPosts: number;
    totalRevenue: number;
  };
  recentOrders: any[];
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
}

export function useDashboard(config?: SWRConfiguration) {
  return useSWR<DashboardData>('/api/admin/dashboard', fetcher, {
    ...HP_CONFIG,
    dedupingInterval: 30_000,
    refreshInterval: 60_000,
    ...config,
  });
}

// ─── Orders ───

interface OrdersParams {
  page?: number;
  status?: string;
  search?: string;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDir?: string;
}

export function useOrders(params: OrdersParams = {}, config?: SWRConfiguration) {
  const url = buildUrl('/api/admin/orders', {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    status: params.status,
    search: params.search,
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    sortBy: params.sortBy,
    sortDir: params.sortDir,
  });
  return useSWR(url, fetcher, {
    ...HP_CONFIG,
    ...config,
  });
}

// ─── Customers ───

interface CustomersParams { page?: number; search?: string; limit?: number }

export function useCustomers(params: CustomersParams = {}, config?: SWRConfiguration) {
  const url = buildUrl('/api/admin/customers', {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    search: params.search,
  });
  return useSWR(url, fetcher, {
    ...HP_CONFIG,
    ...config,
  });
}

// ─── Blog ───

interface BlogParams { page?: number; status?: string; search?: string; limit?: number }

export function useBlogPosts(params: BlogParams = {}, config?: SWRConfiguration) {
  const url = buildUrl('/api/admin/blog', {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    status: params.status,
    search: params.search,
  });
  return useSWR(url, fetcher, {
    ...HP_CONFIG,
    ...config,
  });
}

// ─── Pages ───

interface PagesParams { page?: number; status?: string; search?: string; limit?: number }

export function usePages(params: PagesParams = {}, config?: SWRConfiguration) {
  const url = buildUrl('/api/admin/pages', {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    status: params.status,
    search: params.search,
  });
  return useSWR(url, fetcher, {
    ...HP_CONFIG,
    ...config,
  });
}

// ─── Invoices ───

interface InvoicesParams { page?: number; status?: string; search?: string; limit?: number }

export function useInvoices(params: InvoicesParams = {}, config?: SWRConfiguration) {
  const url = buildUrl('/api/admin/invoices', {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    status: params.status,
    search: params.search,
  });
  return useSWR(url, fetcher, {
    ...HP_CONFIG,
    ...config,
  });
}

// ─── Products ───

interface ProductsParams { page?: number; search?: string; limit?: number }

export function useProducts(params: ProductsParams = {}, config?: SWRConfiguration) {
  const url = buildUrl('/api/admin/products', {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    search: params.search,
  });
  return useSWR(url, fetcher, {
    ...HP_CONFIG,
    ...config,
  });
}

// ─── Media ───

interface MediaParams {
  page?: number;
  search?: string;
  limit?: number;
  imagesOnly?: boolean;
  folder?: string;
  sortBy?: string;
  sortDir?: string;
  _t?: number; // Cache buster
}

export function useMedia(params: MediaParams = {}, config?: SWRConfiguration) {
  const url = buildUrl('/api/admin/media', {
    page: params.page ?? 1,
    limit: params.limit ?? 24,
    search: params.search,
    imagesOnly: params.imagesOnly === false ? 'false' : undefined,
    folder: params.folder,
    sortBy: params.sortBy,
    sortDir: params.sortDir,
    _t: params._t,
  });
  return useSWR(url, fetcher, {
    ...HP_CONFIG,
    // Disable keepPreviousData for media to prevent stale cache
    // after upload/delete mutations
    keepPreviousData: false,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 0, // Disable deduping to always fetch fresh data
    ...config,
  });
}

// ─── Payments ───

export function usePayments(config?: SWRConfiguration) {
  return useSWR('/api/admin/payments', fetcher, {
    ...HP_CONFIG,
    dedupingInterval: 30_000,
    ...config,
  });
}

// ─── Settings ───

export function useSettings(config?: SWRConfiguration) {
  return useSWR('/api/admin/settings', fetcher, {
    ...HP_CONFIG,
    dedupingInterval: 60_000,
    ...config,
  });
}

// ─── Email Campaigns ───

interface CampaignsParams { page?: number; status?: string; search?: string; limit?: number }

export function useCampaigns(params: CampaignsParams = {}, config?: SWRConfiguration) {
  const url = buildUrl('/api/admin/email-campaigns', {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    status: params.status,
    search: params.search,
  });
  return useSWR(url, fetcher, {
    ...HP_CONFIG,
    ...config,
  });
}

// ─── Coupons ───

interface CouponsParams { page?: number; status?: string; search?: string; limit?: number }

export function useCoupons(params: CouponsParams = {}, config?: SWRConfiguration) {
  const url = buildUrl('/api/admin/coupons', {
    page: params.page ?? 1,
    limit: params.limit ?? 20,
    status: params.status,
    search: params.search,
  });
  return useSWR(url, fetcher, {
    ...HP_CONFIG,
    ...config,
  });
}
