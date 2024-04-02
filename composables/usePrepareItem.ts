export default function <T>(
  items: ComputedRef<T[]>,
  compareFn: (a: T, b: T) => number,
  perPage: number = 6
) {
  // paginate
  const currentPage = ref(1);
  const totalPage = computed(() => {
    return Math.ceil((items.value.length || 0) / perPage);
  });
  // sort
  type SortBy = "oldest" | "latest";
  const sortBy = ref<SortBy>("latest");
  const sortConf: Record<
    SortBy,
    {
      label: string;
      iconName: string;
    }
  > = {
    oldest: { label: "Oldest", iconName: "mdi:arrow-down" },
    latest: { label: "Latest", iconName: "mdi:arrow-up" },
  };
  const preparedItems = computed(() => {
    let sorted =
      sortBy.value === "latest"
        ? items.value.toSorted((a, b) => compareFn(a, b))
        : items.value.toSorted((a, b) => compareFn(b, a));
    return sorted.slice(
      (currentPage.value - 1) * perPage,
      currentPage.value * perPage
    );
  });
  watch(items, () => {
    currentPage.value = 1;
  });
  return {
    currentPage,
    totalPage,
    sortBy,
    sortConf,
    preparedItems,
  };
}
