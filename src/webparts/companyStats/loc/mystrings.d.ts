declare interface ICompanyStatsStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  EmployeesFieldLabel: string;

}

declare module 'companyStatsStrings' {
  const strings: ICompanyStatsStrings;
  export = strings;
}
