import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneCheckbox
} from '@microsoft/sp-client-preview';
import importableModuleLoader from '@microsoft/sp-module-loader';
import styles from './CompanyStats.module.scss';
import * as strings from 'companyStatsStrings';
import { ICompanyStatsWebPartProps } from './ICompanyStatsWebPartProps';

import * as $ from 'jquery';
var ProgressBar = require('progressbar');
var CanvasJS = require('canvasjs');
var ChartJS = require('chartjs');
require('jqueryui');

require('circleprogress');

export default class CompanyStatsWebPart extends BaseClientSideWebPart<ICompanyStatsWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
    importableModuleLoader.loadCss('//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
  }

  public render(): void {
    var checked : Boolean = this.properties.showTabs;

    if(!checked) {
      this.domElement.innerHTML = `
      <div class="ms-Grid ${styles.companyStats}">
      <p class="ms-font-xxl ${styles.header}">${this.properties.description}</p>
        <div class="ms-Grid-row">
          <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg6">
            <p class="ms-font-l ${styles.header}">Number of Employees</p>
              <div id="employeescircle" class="${styles.circle}">
                <strong></strong>
              </div>
          </div>
          <div class="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg6">
          <p class="ms-font-l ${styles.header}">Revenue</p>
            <div id="revenueChart">
              <canvas></canvas>
            </div>
          </div>
        </div>
        <div class="ms-Grid-row">
          <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg6">
            <p class="ms-font-l ${styles.header}">Employee Satisfaction Rate</p>
            <div id="satisfactionChart">
              <canvas></canvas>
            </div>
          </div>
          <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg6">
            <p class="ms-font-l ${styles.header}">Some data</p>
            <div id="doughnutChart">
              <canvas></canvas>
            </div>
          </div>
        </div>
      </div>`;
      this.renderEmployees(120);
    }
    else {
      this.domElement.innerHTML = `
      <div id="tabs" class="${styles.companyStats}">
      <p class="ms-font-xxl ${styles.header}">${this.properties.description}</p>
        <ul>
          <li><a href="#tabs-1" class="ms-font-l" id="aEmployees">Number of Employees</a></li>
          <li><a href="#tabs-2" class="ms-font-l" id="aRevenue">Revenue</a></li>
          <li><a href="#tabs-3" class="ms-font-l" id="aSatisfaction">Employee Satisfaction Rate</a></li>
          <li><a href="#tabs-4" class="ms-font-l" id="aSomedata">Some data</a></li>
        </ul>
          <div id="tabs-1">
            <p class="ms-font-l ${styles.header}">Number of Employees</p>
              <div id="employeescircle" class="${styles.circle} ${styles.leftextra}">
                <strong class="${styles.strongextra}"></strong>
              </div>
          </div>
          <div id="tabs-2">
            <p class="ms-font-l ${styles.header}">Revenue</p>
            <div id="revenueChart">
              <canvas></canvas>
            </div>
          </div>
          <div id="tabs-3">
            <p class="ms-font-l ${styles.header}">Employee Satisfaction Rate</p>
            <div id="satisfactionChart">
              <canvas></canvas>
            </div>
          </div>
          <div id="tabs-4">
            <p class="ms-font-l ${styles.header}">Some data</p>
            <div id="doughnutChart">
              <canvas></canvas>
            </div>
          </div>
      </div>`;
      this.renderEmployees(180);
    }


    this.renderRevenue();
    this.renderSatisfaction();
    this.renderDoughnut();

    $("#tabs").tabs();
  }

  private renderEmployees(size: number): void{
    ($ as any)('#employeescircle').circleProgress({
          value: this.properties.numberOfEmployees / 1000,
          size: size,
          fill: {
            gradient: ["#336699", "#336699"]
          }
          }).on('circle-animation-progress', function(event, progress, stepValue) {
            $(this).find('strong').text(String(stepValue.toFixed(3)).substr(2));
      });
  }

  private renderRevenue(): void{
      var canvas = <HTMLCanvasElement> $("#revenueChart").find('canvas').get(0);
      var ctx = <CanvasRenderingContext2D> canvas.getContext("2d");
      var revenueChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ["2014", "2015", "2016"],
              datasets: [{
                  label: 'in £ million',
                  data: [
                    this.properties.revenueYear3,
                    this.properties.revenueYear2,
                    this.properties.revenueYear1
                  ],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  xAxes: [{
                      stacked: true
                  }],
                  yAxes: [{
                      stacked: true
                  }]
              }
          }
      });
  }

  private renderSatisfaction(): void{

      var canvas = <HTMLCanvasElement> $("#satisfactionChart").find('canvas').get(0);
      var ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

      var data = {
          labels: ["Work", "Colleagues", "Fun", "Social"],
          datasets: [
              {
                  label: "Satisfaction in %",
                  backgroundColor: "rgba(179,181,198,0.2)",
                  borderColor: "rgba(179,181,198,1)",
                  pointBackgroundColor: "rgba(179,181,198,1)",
                  pointBorderColor: "#fff",
                  pointHoverBackgroundColor: "#fff",
                  pointHoverBorderColor: "rgba(179,181,198,1)",
                  data:
                  [
                    this.properties.workSatisfactionRate,
                    this.properties.colleagueSatisfactionRate,
                    this.properties.funSatisfactionRate,
                    this.properties.socialSatisfactionRate
                  ]
              }
          ]
      };

      var satisfactionChart = new Chart(ctx, {
          type: 'radar',
          data: data
      });
  }

  private renderDoughnut(): void{

      var canvas = <HTMLCanvasElement> $("#doughnutChart").find('canvas').get(0);
      var ctx = <CanvasRenderingContext2D> canvas.getContext("2d");

      var data = {
          labels: [
              "Red",
              "Blue",
              "Yellow"
          ],
          datasets: [
              {
                  data: [
                    this.properties.doughnutData1,
                    this.properties.doughnutData2,
                    this.properties.doughnutData3
                  ],
                  backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                  ],
                  hoverBackgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56"
                  ]
              }]
      };

      var doughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: data
      });
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: "Global properties"
          },
          groups: [
            {
              groupName: "Global properties",
              groupFields: [
                PropertyPaneCheckbox('showTabs', {
                  text: 'Show in tabs',
                  isChecked: true,
                  isEnabled: true
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        },
        {
          header: {
            description: "Data in top row"
          },
          groups: [
            {
              groupName: "Number of Employees",
              groupFields: [
                PropertyPaneTextField('numberOfEmployees', {
                  label: strings.EmployeesFieldLabel
                })
              ]
            },
            {
              groupName: "Revenue",
              groupFields: [
                PropertyPaneTextField('revenueYear1', {
                  label: "Revenue in current year"
                }),
                PropertyPaneTextField('revenueYear2', {
                  label: "Revenue in previous year"
                }),
                PropertyPaneTextField('revenueYear3', {
                  label: "Revenue in year before"
                })
              ]
            }
          ]
        },
        {
          header: {
            description: "Data in bottom row"
          },
          groups: [
            {
              groupName: "Rates",
              groupFields: [
                PropertyPaneTextField('workSatisfactionRate', {
                  label: 'Work Satisfaction Rate'
                }),
                PropertyPaneTextField('colleagueSatisfactionRate', {
                  label: 'Colleague Satisfaction Rate'
                }),
                PropertyPaneTextField('funSatisfactionRate', {
                  label: 'Fun Satisfaction Rate'
                }),
                PropertyPaneTextField('socialSatisfactionRate', {
                  label: 'Social Satisfaction Rate'
                })
              ]
            },
            {
              groupName: "Some data",
              groupFields: [
                PropertyPaneTextField('doughnutData1', {
                  label: "Some data 1"
                }),
                PropertyPaneTextField('doughnutData2', {
                  label: "Some data 2"
                }),
                PropertyPaneTextField('doughnutData3', {
                  label: "Some data 3"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}