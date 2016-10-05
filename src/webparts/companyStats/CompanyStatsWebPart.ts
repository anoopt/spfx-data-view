import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneToggle
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
require('jqueryreflection');
require('cloud9carousel');

import MockHttpClient from './MockHttpClient';

export interface IShareItems {
    value: IShareItem[];
}

export interface IShareItem {
    IconClass: string;
    Title: string;
    Byline: string;
}

export default class CompanyStatsWebPart extends BaseClientSideWebPart<ICompanyStatsWebPartProps> {
  private guid: string;
  public constructor(context: IWebPartContext) {
    super(context);
    importableModuleLoader.loadCss('//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css');
    this.guid = this.getGuid();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyChange = this.onPropertyChange.bind(this);
    this.rendered = this.rendered.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
  }

  private _getMockListData(): Promise<IShareItems> {
    return MockHttpClient.get(this.context.pageContext.web.absoluteUrl)
        .then((data: IShareItem[]) => {
             var listData: IShareItems = { value: data };
             return listData;
         }) as Promise<IShareItems>;
  }

  private _renderSharesAsync(xOrigin: number): void {
      this._getMockListData().then((response) => {
        this._renderShares(response.value, xOrigin);
      });

  }

  private _renderShares(items: IShareItem[], xOrigin: number): void {
    var html = '<div id="' + this.guid + '-bigCarousel" style="height:0px; visibility: hidden"><div id="' + this.guid + '-carousel"> ';
    items.forEach((item: IShareItem, index: number) => {

          html += '<div class="cloud9-item">';
          html += `<div class="ms-PersonaCard-persona ${styles.card}">`;
          html += `<div class="ms-Persona ms-Persona--lg ${styles.card}">`;
          html += `<div class="ms-Persona-imageArea ${styles.imageArea}">`;
          html += `<i class="ms-Persona-image ms-font-su ms-Icon ms-Icon--${item.IconClass} ${styles.statIcon}" aria-hidden="true"></i>`;
          html += '</div>';
          html += `<div class="ms-Persona-details ${styles.statDetails}">`;
          html += `<div class="ms-Persona-primaryText ${styles.statTopText}">${item.Title}</div>`;
          html += `<div class="ms-font-su">${item.Byline}</div>`;

          html += '</div>';
          html += '</div>';
          html += '</div></div>';
    });
    html += `</div>`;

    const newsItemsHolder: Element = this.domElement.querySelector('#marketStats');
    newsItemsHolder.innerHTML = html;

    if (($ as any)('#' + this.guid + '-carousel') != null) {

      ($ as any)('#' + this.guid + '-carousel').Cloud9Carousel({
        //buttonLeft: $("#" + this.guid + "-buttons > .left"),
        //buttonRight: $("#" + this.guid + "-buttons > .right"),
        autoPlay: 1,
        autoPlayDelay: 4000,
        bringToFront: true,
        speed: 6,
        yOrigin: 43,
        yRadius: 86,
        xOrigin: xOrigin,
        xRadius: 320,
        mirror: {
          gap: 2,
          height: 0.2,
          opacity: 0.4
        },
        onRendered: this.rendered,
        onLoaded: this.onLoaded,
      });
    }
  }

   private onLoaded(): void  {
    $("#" + this.guid + "-bigCarousel").css( 'visibility', 'visible' );
    $("#" + this.guid + "-bigCarousel").css( 'height', 400);
    $("#" + this.guid + "-carousel").css( 'visibility', 'visible' );
    $("#" + this.guid + "-carousel").css( 'display', 'block' );
    $("#" + this.guid + "-carousel").css( 'overflow', 'visible' );
    $("#" + this.guid + "-carousel").fadeIn( 1500 );
  }

  private rendered(carousel: any) {

  }

  private getGuid(): string {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
      this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  private s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

  public render(): void {
    var checked : Boolean = this.properties.showTabs;

    if (($ as any)('#' + this.guid + '-carousel').data("carousel") != null) {
        ($ as any)('#' + this.guid + '-carousel').data("carousel").deactivate();
        ($ as any)('#' + this.guid + '-carousel').data("carousel").onRendered = null;
    }

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
        <div class="ms-Grid-row">
          <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg12">
            <p class="ms-font-l ${styles.header}">Shares</p>
            <div id="lineChart">
              <canvas></canvas>
            </div>
          </div>
          <div class="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg12">
            <p class="ms-font-l ${styles.header}">Market stats</p>
            <div id="marketStats"></div>
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

      Functions.renderLineChart(this.properties.shareprice2011,
                                this.properties.shareprice2012,
                                this.properties.shareprice2013,
                                this.properties.shareprice2014,
                                this.properties.shareprice2015,
                                this.properties.shareprice2016);
      this._renderSharesAsync(350);
    }
    else {
      this.domElement.innerHTML = `
      <div id="tabs" class="${styles.companyStats}">
      <p class="ms-font-xxl ${styles.header}">${this.properties.description}</p>
        <ul>
          <li><a href="#tabs-1" class="ms-font-l" id="aEmployees">Employees</a></li>
          <li><a href="#tabs-2" class="ms-font-l" id="aRevenue">Revenue</a></li>
          <li><a href="#tabs-3" class="ms-font-l" id="aSatisfaction">Satisfaction Rate</a></li>
          <li><a href="#tabs-4" class="ms-font-l" id="aSomedata">Some data</a></li>
          <li><a href="#tabs-5" class="ms-font-l" id="aShares">Shares</a></li>
          <li><a href="#tabs-6" class="ms-font-l" id="aStats">Stats</a></li>
        </ul>
          <div id="tabs-1">
            <p class="ms-font-su ${styles.header}">Number of Employees</p>
              <div id="employeescircle" class="${styles.circle} ${styles.leftextra}">
                <strong class="${styles.strongextra}"></strong>
              </div>
          </div>
          <div id="tabs-2">
            <p class="ms-font-su ${styles.header}">Revenue</p>
            <div id="revenueChart">
              <canvas id="results-graph"></canvas>
            </div>
          </div>
          <div id="tabs-3">
            <p class="ms-font-su ${styles.header}">Employee Satisfaction Rate</p>
            <div id="satisfactionChart">
              <canvas></canvas>
            </div>
          </div>
          <div id="tabs-4">
            <p class="ms-font-su ${styles.header}">Some data</p>
            <div id="doughnutChart">
              <canvas></canvas>
            </div>
          </div>
          <div id="tabs-5">
            <p class="ms-font-su ${styles.header}">Shares</p>
            <div id="lineChart">
              <canvas></canvas>
            </div>
          </div>
          <div id="tabs-6">
            <p class="ms-font-su ${styles.header}">Market Stats</p>
            <div id="marketStats" class=${styles.marketStats}></div>
          </div>
      </div>`;
      Functions.renderEmployees(180, this.properties.numberOfEmployees);
      this._renderSharesAsync(240);
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

      var shareprices: number[] = [
                                this.properties.shareprice2011,
                                this.properties.shareprice2012,
                                this.properties.shareprice2013,
                                this.properties.shareprice2014,
                                this.properties.shareprice2015,
                                this.properties.shareprice2016
                                ];

      $('#aShares').click(function(){
        Functions.renderLineChart(shareprices[0],shareprices[1],shareprices[2],shareprices[3],shareprices[4],shareprices[5]);
      })
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: "All properties"
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "Global properties",
              groupFields: [
                PropertyPaneToggle('showTabs', {
                  label: 'Show in tabs'
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            },
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
            },
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
            },
            {
              groupName: "Share price history",
              groupFields: [
                PropertyPaneTextField('shareprice2011', {
                  label: "Share Price in 2011"
                }),
                PropertyPaneTextField('shareprice2012', {
                  label: "Share Price in 2012"
                }),
                PropertyPaneTextField('shareprice2013', {
                  label: "Share Price in 2013"
                }),
                PropertyPaneTextField('shareprice2014', {
                  label: "Share Price in 2014"
                }),
                PropertyPaneTextField('shareprice2015', {
                  label: "Share Price in 2015"
                }),
                PropertyPaneTextField('shareprice2016', {
                  label: "Share Price in 2016"
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }
}
