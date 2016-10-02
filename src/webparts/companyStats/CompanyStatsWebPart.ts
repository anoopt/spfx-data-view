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
import Functions from './Functions'

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
      Functions.renderEmployees(120, this.properties.numberOfEmployees);

      Functions.renderRevenue(this.properties.revenueYear3,
                              this.properties.revenueYear2,
                              this.properties.revenueYear1);

      Functions.renderSatisfaction(this.properties.workSatisfactionRate,
                    this.properties.colleagueSatisfactionRate,
                    this.properties.funSatisfactionRate,
                    this.properties.socialSatisfactionRate);

      Functions.renderDoughnut(this.properties.doughnutData1,
                                  this.properties.doughnutData2,
                                  this.properties.doughnutData3);
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
              <canvas id="results-graph"></canvas>
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
      Functions.renderEmployees(180, this.properties.numberOfEmployees);
      $("#tabs").tabs();
      this.registerEvents();
    }
  }

  private registerEvents(): void{
    var employeesToBePassed = this.properties.numberOfEmployees;
      $('#aEmployees').click(function(){
        Functions.renderEmployees(180, employeesToBePassed);
      });

      var revenueData : number[] = [this.properties.revenueYear1,
                                    this.properties.revenueYear2,
                                    this.properties.revenueYear3];
      $('#aRevenue').click(function(){
        Functions.renderRevenue(revenueData[2],revenueData[1],revenueData[0]);
      });

      var satisfactionData: number[] =[
                      this.properties.workSatisfactionRate,
                      this.properties.colleagueSatisfactionRate,
                      this.properties.funSatisfactionRate,
                      this.properties.socialSatisfactionRate];

      $('#aSatisfaction').click(function(){
        Functions.renderSatisfaction(satisfactionData[0],satisfactionData[1],satisfactionData[2],satisfactionData[3]);
      });

      var doughnutData : number[] = [this.properties.doughnutData1,
                                    this.properties.doughnutData2,
                                    this.properties.doughnutData3];
      $('#aSomedata').click(function(){
        Functions.renderDoughnut(doughnutData[2],doughnutData[1],doughnutData[0]);
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
