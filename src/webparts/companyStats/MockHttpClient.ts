import { IShareItem } from './CompanyStatsWebpart';

export default class MockHttpClient {

    private static _items: IShareItem[] =
    [
      {
        IconClass:"Money",
        Title: 'Share Price',
        Byline: '$57.85'
      },
      {
        IconClass:"BarChart4",
        Title: 'EBITDA',
        Byline: '$27.17B'
      },
      {
        IconClass:"Financial",
        Title: 'Market share',
        Byline: '$450.87B'
      },
      {
        IconClass:"StockDown",
        Title: 'Day\'s low',
        Byline: '$56.23'
      },{
        IconClass:"StockUp",
        Title: 'Day\'s high',
        Byline: '$58.86'
      },
      {
        IconClass:"ExchangeLogo",
        Title: 'Stock Exchange',
        Byline: 'NMS'
      },
      {
        IconClass:"HomeSolid",
        Title: 'Company',
        Byline: 'Microsoft'
      }
    ];

    public static get(restUrl: string, options?: any): Promise<IShareItem[]> {
    return new Promise<IShareItem[]>((resolve) => {
            resolve(MockHttpClient._items);
        });
    }
}