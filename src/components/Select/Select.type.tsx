// T c'est pour passer un type défini au moment du typage
export interface SelectOptionItem<T> {
  name: string;
  value: T; // type générique (Pas besoin de spécifier un type particulier)
}
