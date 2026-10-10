# Hotspot subscriptions component split

## Files
- `HotspotSubscriptionPage.tsx` — page orchestration, data loading, filtering state, pagination state, create/update submission.
- `components/SubscriptionFilters.tsx` — search, status filter, sort toggle.
- `components/SubscriptionFormModal.tsx` — create/edit form modal.
- `components/SubscriptionList.tsx` — responsive desktop table and mobile subscription cards.
- `components/SubscriptionPagination.tsx` — pagination controls.
- `components/StatusBadge.tsx` — active/inactive state badge.
- `types.ts` — form and component prop types.
- `utils.ts` — date formatting helpers.

## Integration
Place `HotspotSubscriptionPage.tsx` at the same location as the original page so its existing `../../api/...` and `../../types/...` imports continue to resolve. Keep the `components` folder, `types.ts`, and `utils.ts` beside that page.

The existing API functions and endpoint paths are retained. The visual language remains blue/white/slate with rounded surfaces, subtle borders, shadows, and dark-mode classes. This refactor has not been compiled against your project, so verify TypeScript types and API payload expectations before deploying.
