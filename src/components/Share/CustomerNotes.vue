<template>

    <div>

        <el-drawer
            :title="drawerTitle"
            :visible.sync="drawer_"
            :direction="direction"
            size="100%"
            :before-close="handleCloseDrawer">
            <span class="bullets"></span>

            <el-tabs v-model="tabs_active" @tab-click="handleTabClick" style="width: 94%; margin: 0 auto; margin-bottom: 30px; padding: 20px 30px; border: 1px dashed #ccc;">

                <el-tab-pane label="客户信息" name="first">

                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" >

                        <el-row style="font-size: 14px; font-weight: 500; margin-bottom: 20px; margin-top: 20px;">
                            客户信息：
                        </el-row>

                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="客户手机" prop="tel">
                                    <el-input v-model.trim="ruleForm.tel" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                                <div style="position: relative; left: 226px; top: -42px;" v-if="!routePathFlag">
                                    <svg-icon icon-class="copy" icon-title="复制手机号码" @click="phoneCopy()" />
                                    <svg-icon style="color: #409EFF" icon-title="手机外拨" @click="phoneOut()" icon-class="takephone" />
                                    <svg-icon style="color: #409EFF" icon-title="座机外拨" @click="seatOut()" icon-class="landline" />
                                    <el-popconfirm
                                        confirmButtonText='确定'
                                        cancelButtonText='取消'
                                        icon="el-icon-info"
                                        iconColor="red"
                                        placement="top"
                                        title="确认释放该数据吗？"
                                        @onConfirm="release()"
                                      >
                                        <svg-icon v-if="!releaseFlag" style="color: #409EFF" slot="reference" icon-title="释放数据" icon-class="release" />
                                    </el-popconfirm>
                                </div>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="入库时间" prop="createTime">
                                    <el-input v-model="ruleForm.createTime" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="所在省市" prop="provinceCity"  class="seatData">

                                    <area-cascader type="text" placeholder="请选择地区" v-model="ruleForm.provinceCity" @change="cityChange" :data="pcaa" v-if="!routePathFlag" :class="['screen-li', {'areaSelected': ruleForm.city, 'areaDefault': !ruleForm.city}]"></area-cascader>

                                    <el-input v-model="ruleForm.provinceCity" :readonly="routePathFlag" :class="routePathFlag ? 'borderNone' : ''" v-if="routePathFlag"></el-input>

                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <!-- <el-form-item label="客户编号" prop="number">
                                    <el-input v-model="ruleForm.number" readonly size="small" class="borderNone"></el-input>
                                </el-form-item> -->
                                <el-form-item label="客户微信" prop="wx">
                                    <el-input v-model="ruleForm.wx" size="small" :readonly="routePathFlag" :class="routePathFlag ? 'borderNone' : ''"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>

                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="最近联系" prop="callLastTime">
                                    <el-input v-model="ruleForm.callLastTime" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="客户姓名" prop="name">
                                    <el-input v-model="ruleForm.name" size="small" :readonly="routePathFlag" :class="routePathFlag ? 'borderNone' : ''"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="客户年龄" prop="age">
                                    <el-input-number
                                        v-model="ruleForm.age"
                                        :precision="0"
                                        :step="1"
                                        :min="1"
                                        :max="150"
                                        size="small"
                                        style="width: 100%;"
                                        v-if="!routePathFlag"
                                    ></el-input-number>
                                    <el-input v-model="ruleForm.age" :readonly="routePathFlag" :class="routePathFlag ? 'borderNone' : ''" v-if="routePathFlag"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="最高学历" prop="education">

                                    <el-select
                                        v-model="ruleForm.education"
                                        placeholder="请选择最高学历"
                                        size="small"
                                        :disabled="routePathFlag"
                                    >
                                        <el-option
                                          v-for="item in enumList['MJ-1']"
                                          :key="item.name"
                                          v-if="item.enable"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                        </el-row>

                        <el-row>

                            <el-col :span="6">
                                <el-form-item label="客户工作" prop="work">
                                    <el-input v-model="ruleForm.work" size="small" :readonly="routePathFlag" :class="routePathFlag ? 'borderNone' : ''"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="取证目的" prop="evidencePurpose">

                                    <el-select
                                        v-model="ruleForm.evidencePurpose"
                                        placeholder="请选择取证目的"
                                        size="small"
                                        :disabled="routePathFlag"
                                    >
                                        <el-option
                                          v-for="item in enumList['MJ-3']"
                                          :key="item.name"
                                          v-if="item.enable"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>
                            </el-col>

                            <el-col :span="6">

                                <el-form-item label="工作年限" prop="workingLife">

                                    <el-select
                                        v-model="ruleForm.workingLife"
                                        placeholder="请选择工作年限"
                                        size="small"
                                        :disabled="routePathFlag"
                                    >
                                        <el-option
                                          v-for="item in enumList['MJ-2']"
                                          :key="item.name"
                                          v-if="item.enable"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="第二电话" prop="twoTel">
                                    <el-input v-model="ruleForm.twoTel" size="small" :readonly="routePathFlag" :class="routePathFlag ? 'borderNone' : ''"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>

                        <el-row>

                            <el-col :span="6">

                                <el-form-item label="客户性别" prop="gender">

                                    <el-select
                                        v-model="ruleForm.gender"
                                        placeholder="请选择性别"
                                        size="small"
                                        :disabled="routePathFlag"
                                    >
                                        <el-option
                                          v-for="item in genderList"
                                          :key="item.name"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>

                            <el-col :span="6">
                                <el-form-item label="注册平台" prop="school">
                                    <el-input v-model="ruleForm.school" readonly size="small" class="borderNone"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>

                        <el-row style="border-top: 1px dashed #ccc; margin-bottom: 20px; margin-top: 20px;" v-if="!routePathFlag"></el-row>

                        <el-row style="font-size: 14px; font-weight: 500; margin-bottom: 20px;" v-if="followFlag">跟进信息：</el-row>

                        <el-row v-if="followFlag">
                            <el-col :span="6">
                                <el-form-item label="主推班型" prop="classType">

                                    <el-autocomplete
                                        clearable
                                        size="small"
                                        style="width: 100%;"
                                        ref="autocompleteMain"
                                        v-model="ruleForm.classTypeText"
                                        :fetch-suggestions="querySearchMain"
                                        placeholder="请输入主推班型"
                                        :trigger-on-focus="true"
                                        @select="handleSelectMain"
                                        @clear="autocompleteClearMain"
                                    ></el-autocomplete>

                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="班型报价" prop="classOffer">
                                    <el-input-number v-model="ruleForm.classOffer" :precision="2" :step="1" :min="0" size="small" style="width: 100%;"></el-input-number>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">

                                <el-form-item label="意向等级" prop="intentionLevel">

                                    <el-select v-model="ruleForm.intentionLevel" placeholder="请选择意向等级" size="small">
                                        <el-option
                                          v-for="item in enumList['MJ-5']"
                                          :key="item.name"
                                          v-if="item.enable"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="截杀承诺" prop="runOutPromise">
                                    <el-input v-model="ruleForm.runOutPromise" placeholder="请选择截杀承诺" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row v-if="followFlag">
                            <el-col :span="6">
                                <el-form-item label="兴趣班型" prop="classType2Text">

                                    <el-autocomplete
                                        clearable
                                        size="small"
                                        style="width: 100%;"
                                        ref="autocomplete"
                                        v-model="ruleForm.classType2Text"
                                        :fetch-suggestions="querySearch"
                                        placeholder="请输入兴趣班型"
                                        :trigger-on-focus="true"
                                        @select="handleSelect"
                                        @clear="autocompleteClear"
                                    ></el-autocomplete>

                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="班型报价" prop="classOffer2">
                                    <el-input-number v-model="ruleForm.classOffer2" :precision="2" :step="1" :min="0" size="small" style="width: 100%;"></el-input-number>
                                </el-form-item>
                            </el-col>

                            <el-col :span="6">

                                <el-form-item label="意向等级" prop="intentionLevel2">

                                    <el-select v-model="ruleForm.intentionLevel2" placeholder="请选择意向等级" size="small">
                                        <el-option
                                          v-for="item in enumList['MJ-5']"
                                          :key="item.name"
                                          v-if="item.enable"
                                          :label="item.name"
                                          :value="item.number">
                                        </el-option>
                                    </el-select>

                                </el-form-item>

                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="截杀承诺" prop="runOutPromise2">
                                    <el-input v-model="ruleForm.runOutPromise2" placeholder="请选择截杀承诺" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row v-if="followFlag">

                            <el-col :span="6">
                                <el-form-item label="下次联系时间" prop="nextContactTime">

                                    <el-date-picker
                                      v-model="ruleForm.nextContactTime"
                                      style="width: 100%;"
                                      type="datetime"
                                      size="small"
                                      @change="pickerTimeChange"
                                      placeholder="请选择下次联系时间">
                                    </el-date-picker>

                                </el-form-item>
                            </el-col>

                            <el-col :span="6">

                                <el-form-item label="沟通方式" prop="comModeName">

                                    <el-input v-model="ruleForm.comModeName" readonly size="small" class="borderNone"></el-input>

                                </el-form-item>

                            </el-col>
                        </el-row>

                        <el-row v-if="!routePathFlag && followFlag">

                            <el-col :span="18">
                                <el-form-item label="其他备注" prop="remarks">

                                    <el-input
                                        type="textarea"
                                        v-model="ruleForm.remarks"
                                        size="small"
                                        show-word-limit
                                        maxlength='300'
                                        placeholder="请输入其他备注"
                                    ></el-input>

                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row style="border-top: 1px dashed #ccc; margin-bottom: 20px; margin-top: 20px;" v-if="!routePathFlag"></el-row>
                        <el-row style="font-size: 14px; font-weight: 500; margin-bottom: 20px;" v-if="followFlag">备注记录：</el-row>
                        <el-table
                            :data="remarkNotesList"
                            max-height="250"
                            style="margin: 0 auto; margin-bottom: 30px;"
                        >
                            <el-table-column
                                label="序号"
                                type="index"
                                width="50">
                            </el-table-column>
                            <el-table-column
                                :prop="item.prop"
                                :label="item.label"
                                v-for="(item, index) in remarkColumnList"
                                :min-width="item.width"
                                :key="index"
                            >
                            </el-table-column>
                            <!--:show-overflow-tooltip="item.prop == 'remarks' ? true : false"-->
                        </el-table>
                        <el-form-item style="text-align: center;">
                          <el-button type="primary" @keyup.enter="submitForm('ruleForm')" @click="submitForm('ruleForm')" size="small" style="width: 100px;" v-if="!routePathFlag">确定</el-button>
                          <el-button @click="quxiao" plain size="small" style="width: 100px;" v-if="!routePathFlag">取消</el-button>
                        </el-form-item>

                    </el-form>

                </el-tab-pane>

                <el-tab-pane label="订单记录" name="second">
                    <el-table :data="orderList"
                              v-loading = "pictLoading"
                    >
                        <el-table-column
                            v-for="(item, index) in orderListColumn"
                            :label="item.label"
                            :prop="item.prop"
                            :key="index"
                            :formatter="item.formatter"
                        ></el-table-column>

                        <el-table-column prop="active" fixed="right" label="操作" width="70" class-name="table_active">
                            <template slot-scope="scope">
                                <svg-icon icon-title="查看协议" @click="lookAgreementDetailsClick(scope.row)" icon-class="info" class="svg-handle" />
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="跟进记录" name="third">

                    <el-table
                        :data="notesList"
                        style="margin: 0 auto; margin-bottom: 30px;"
                        >
                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          v-for="(item, index) in notesColumnListFollow"
                          :show-overflow-tooltip="item.prop == 'remarks' ? true : false"
                          :min-width="item.width"
                          :key="index"
                          >
                        </el-table-column>
                        <!-- <el-table-column prop="active" label="操作">
                          <template slot-scope="scope">
                              <el-button @click="notesDetails(scope.row)" type="text" >备注详情</el-button>
                          </template>
                        </el-table-column> -->
                    </el-table>

                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total='notesForm.total'
                        :page-size='notesForm.pageSize'
                        :page-sizes="[10, 20, 30, 50, 100]"
                        :hide-on-single-page="totalFlag"
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        v-if="pageshow"
                    >
                    </el-pagination>

                </el-tab-pane>

                <el-tab-pane label="通话记录" name="four">

                    <el-table
                        :data="notesCallList"
                        style="margin: 0 auto; margin-bottom: 30px;"
                        >
                        <el-table-column
                          :prop="item.prop"
                          :label="item.label"
                          v-for="(item, index) in notesColumnListCall"
                          :key="index"
                          >
                        </el-table-column>

                        <el-table-column
                            prop="recordUrl" label="录音播放"
                            :width="columnWidth"
                            v-if="columnFlag"
                        >
                            <template slot-scope="scope">
                                <VueAudio
                                  :theUrl="scope.row.recordUrl"
                                  v-if="scope.row.recordUrl"
                                  theControlList="onlyOnePlaying noMuted noVolume"
                                >
                                </VueAudio>
                            </template>
                        </el-table-column>

                        <!-- <el-table-column prop="active" label="操作">
                          <template slot-scope="scope">
                              <el-button @click="notesDetails(scope.row)" type="text" >备注详情</el-button>
                          </template>
                        </el-table-column> -->

                    </el-table>

                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total='notesCallForm.total'
                        :page-size='notesCallForm.pageSize'
                        :page-sizes="[10, 20, 30, 50, 100]"
                        :hide-on-single-page="totalFlag"
                        @current-change="handleCurrentChangeCall"
                        @size-change="handleSizeChangeCall"
                        v-if="pageshow"
                    >
                    </el-pagination>

                </el-tab-pane>

            </el-tabs>

            <el-drawer
                title="跟进记录备注详情"
                :append-to-body="true"
                :before-close="handleCloseDrawerDetails"
                style="line-height: 30px;"
                :visible.sync="drawerDetails">
            <span class="bullets"></span>

                <el-row>

                    <el-col :span="5" :offset="2">姓名：</el-col>
                    <el-col :span="5">{{notesDetailsForm.form.name}}</el-col>

                    <el-col
                        :span="5"
                        v-if="notesDetailsForm.form.name == notesDetailsForm.form.nameOld"
                        style="text-decoration:line-through;"
                    >( {{notesDetailsForm.form.nameOld}} )</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">微信：</el-col>
                    <el-col :span="5">{{notesDetailsForm.form.wx}}</el-col>

                    <el-col
                        :span="5"
                        v-if="notesDetailsForm.form.wx == notesDetailsForm.form.wxOld"
                        style="text-decoration:line-through;"
                    >( {{notesDetailsForm.form.wxOld}} )</el-col>

                </el-row>

                <el-row style="border-top: 1px dashed #ccc; margin-bottom: 20px; margin-top: 20px;"></el-row>

                <el-row>

                    <el-col :span="5" :offset="2">所属坐席：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notCustomerForm.belongingSeat}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">创建时间：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notCustomerForm.createTime}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">线索编号：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notCustomerForm.number}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">手机号码：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notCustomerForm.tel}}</el-col>

                </el-row>

                <el-row style="border-top: 1px dashed #ccc; margin-bottom: 20px; margin-top: 20px;"></el-row>

                <el-row>

                    <el-col :span="5" :offset="2">班型报价：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.classOffer}}</el-col>

                </el-row>

                <!-- <el-row>

                    <el-col :span="5" :offset="2">主推班型：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.classType}}</el-col>

                </el-row> -->

                <el-row>

                    <el-col :span="5" :offset="2">沟通方式：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.comMode}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">录入人：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.entryPerson}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">意向等级：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.intentionLevel}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">下次联系：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.nextContactTime}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">其他备注：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.remarks}}</el-col>

                </el-row>

                <el-row>

                    <el-col :span="5" :offset="2">截杀承诺：</el-col>
                    <el-col :span="15">{{notesDetailsForm.notes.runOutPromise}}</el-col>

                </el-row>

            </el-drawer>

        </el-drawer>

    </div>

</template>

<script>
import {
    enumByEnumNums,
    addClueDataNotes,
    getClueCallLog,
    getClueDataNotes,
    getClueDataDetails,
    getClueDataNotesDetails,
    getGoodsList,
    getOrderList,
} from '../../request/api';
import pcaa from 'area-data/pcaa';
import { timestampToTime, backType, smoke_MJ_4, smoke_MJ_5, pathWayText, classTypeText, quchong, removeEvery } from '../../assets/js/common';
import { MJ_1, MJ_2, MJ_3, MJ_4, MJ_5 } from '../../assets/js/data';
import VueAudio from '@/components/Share/VueAudio';
import {xieyi} from "@/request/api";
export default {
    name: 'customerNotes',
    components: {
        VueAudio
    },
    props: {
        followFlag: {
            type: Boolean,
            default: false
        },
        drawer: {
            type: Boolean,
            default: false
        },
        userUuid: {
            type: String,
            default: ''
        },
        userId: {
            type: String,
            default: ''
        },
        clueDataSUuid: {
            type: String,
            default: ''
        },
        callLogUuid: {
            type: String,
            default: ''
        },
        comMode: {
            type: String,
            default: ''
        },
        schoolId: {
            type: String,
            default: ''
        },
        examItem: {
            type: String,
            default: ''
        },
        userCDARUuid: {
            type: String,
            default: ''
        },
        scopeRow: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            drawerTitle: '',
            direction: 'btt',
            tabs_active: 'first',
            orderList: [],
            pictLoading: false,
            // 订单记录参数
            getOrderForm: {
                userId: this.userId,
                itemId: '',
                classType: '',
            },
            orderListColumn: [{
                prop: 'goodsName', label:"商品名称"
            },{
                prop: 'orderNo', label:"订单号"
            },{
                prop: 'payMoney', label:"支付金额"
            },{
                prop: 'refer', label:"订单来源"
            },{
                prop: 'orderType', label:"订单类型"
            },{
                prop: 'addTime', label:"下单时间", formatter: (row, column, cellValue) =>{
                    return cellValue ? timestampToTime(Number(cellValue) * 1000) : '--'
                }
            },{
                prop: 'payTime', label:"支付时间", formatter: (row, column, cellValue) =>{
                    return cellValue ? timestampToTime(Number(cellValue) * 1000) : '--'
                }
            },{
                prop: 'userInfo', label:"收货地址"
            },{
                prop: 'hasDelivery', label:"是否发货", formatter: (row, column, cellValue) =>{
                    return cellValue ? '是' : '否'
                }
            },{
                prop: 'shippingId', label:"快递号", formatter: (row, column, cellValue) => {
                    return cellValue ? cellValue : '--'
                }
            }],
            ruleForm: {
                callLogUuid: this.callLogUuid, //通话记录唯一标识
                clueDataSUuid: this.clueDataSUuid, //线索数据的唯一标识

                age: '',
                city: "",
                education: "",
                evidencePurpose: '', //取证目的
                gender: '', //性别(0: 女，1：男)
                name: "",
                province: "",
                provinceCity: [], //所在省市
                twoTel: "", //电话号码2
                work: "",
                workingLife: '', //工作年限
                wx: "",
                school: '', //注册平台
                callLastTime: '', //最近联系
                createTime: '', //入库时间

                classOffer: '', //班型报价
                classOffer2: '', //班型报价
                classType: '', //主推班型
                classTypeText: '',
                classType2: '', //兴趣班型
                classType2Text: '', //兴趣班型Text
                comMode: '', //沟通方式
                comModeName: '', //沟通方式Name
                entryPerson: '', //录入人
                intentionLevel: '', //意向等级
                intentionLevel2: '', //意向等级
                nextContactTime: '', //下次联系时间  时间戳（13位）
                remarks: '', //其他备注
                runOutPromise: '', //截杀承诺
                runOutPromise2: '', //截杀承诺
            },
            rules: {
                // classOffer: [
                //   { required: true, message: '请输入班型报价', trigger: 'blur' },
                // ],
                // classType: [
                //   { required: true, message: '请选择主推班型', trigger: 'blur' }
                // ],
                // nextContactTime: [
                //   { required: true, message: '请选择下次联系时间', trigger: 'blur' }
                // ],
                // runOutPromise: [
                //   { required: true, message: '请输入截杀承诺', trigger: 'blur' }
                // ],
                intentionLevel: [
                  { required: true, message: '请选择意向等级', trigger: 'change' }
                ],
            },
            notesForm: {
                clueDataSUuid: this.clueDataSUuid,
                currentPage: 1,
                pageSize: 20,
                userUuid: "",
                total: null, //总条目数
            },
            notesCallForm: {
                clueDataSUuid: this.clueDataSUuid,
                currentPage: 1,
                pageSize: 20,
                userUuid: "",
                total: null, //总条目数
            },
            pageshow: true, //分页重新渲染
            totalFlag: false, //当只有一页时隐藏分页
            notesList: [],
            remarkNotesList: [], //备注记录
            notesCallList: [],
            remarkColumnList: [
                { 'prop': 'remarks', 'label': '其他备注', 'width': 550 },
                { 'prop': 'entryPerson', 'label': '录入人', width: 150 },
                { 'prop': 'createTime', 'label': '创建时间', width: 150 }
            ],
            notesColumnListFollow: [
                { 'prop': 'createTime', 'label': '创建时间' },
                { 'prop': 'entryPerson', 'label': '录入人' },
                { 'prop': 'remarks', 'label': '其他备注', 'width': 500 },
                { 'prop': 'classType', 'label': '主推班型' },
                { 'prop': 'classOffer', 'label': '班型报价 (元)', 'width': 100 },
                { 'prop': 'intentionLevel', 'label': '意向等级', 'width': 150 },
                { 'prop': 'runOutPromise', 'label': '截杀承诺' },
                { 'prop': 'classType2', 'label': '兴趣班型' },
                { 'prop': 'classOffer2', 'label': '班型报价 (元)', 'width': 100 },
                { 'prop': 'intentionLevel2', 'label': '意向等级', 'width': 150 },
                { 'prop': 'runOutPromise2', 'label': '截杀承诺' },
                { 'prop': 'nextContactTime', 'label': '下次联系时间', 'width': 100 },
                { 'prop': 'comMode', 'label': '沟通方式' },
            ],
            notesColumnListCall: [
                { 'prop': 'createTime', 'label': '创建时间' },
                { 'prop': 'seatName', 'label': '所属坐席' },
                { 'prop': 'isCalledPhone', 'label': '是否接通' },
                { 'prop': 'callStyle', 'label': '呼叫方式' },
                { 'prop': 'duration', 'label': '通话时长(秒)' },
                { 'prop': 'ringTime', 'label': '响铃时长(秒)' },
                // { 'prop': 'recordUrl', 'label': '录音地址' },
            ],
            columnWidth: 90,
            columnFlag: false,
            drawerDetails: false,
            notesDetailsForm: {
                form: {
                    age: 0,
                    ageOld: 0,
                    city: "",
                    cityOld: "",
                    evidencePurpose: 0,  //取证目的
                    evidencePurposeOld: 0,
                    gender: 0,  //性别
                    genderOld: 0,
                    name: "",
                    nameOld: "",
                    province: "",
                    provinceOld: "",
                    twoTel: "",
                    twoTelOld: "",
                    work: "",
                    workOld: "",
                    workingLife: 0,  //工作年限
                    workingLifeOld: 0,
                    wx: "",
                    wxOld: ""
                },
                notCustomerForm: {      //不可修改的线索内容
                    belongingSeat: "",  //所属坐席
                    callLastTime: "",  //最近一次联系时间
                    createTime: "",  //创建时间
                    number: "",  //线索编号
                    tel: ""  //手机号码
                },
                notes: {
                    classOffer: 0,  //班型报价
                    classType: "",  //主推班型
                    comMode: 0,  //沟通方式
                    entryPerson: "",  //录入人
                    intentionLevel: 0,  //意向等级
                    nextContactTime: "",  //下次联系时间
                    remarks: "",  //其他备注
                    runOutPromise: ""  //截杀承诺
                },
            },
            enumList: {},
            genderList: [
                { 'name': '女', 'number': 0 },
                { 'name': '男', 'number': 1 },
            ],
            tabs_active: 'first',
            classTypeList: [],
            pcaa: null, //省市数据
            restaurants: [],
            routePathFlag: false,
            releaseFlag: false,
            isDisable: true,
        }
    },
    mounted() {
        if(this.followFlag) {
            this.drawerTitle = '添加备注';
        }else{
            this.drawerTitle = '客户信息';
        }
        this.notesForm.userUuid = this.userUuid;
        this.notesCallForm.userUuid = this.userUuid;
        let arr = [MJ_1, MJ_2, MJ_3, MJ_4, MJ_5];
        this.enumByEnumNums(arr);
        this.pcaa = pcaa;

        this.ruleForm.classOffer = '';
        this.ruleForm.classOffer2 = '';
        this.ruleForm.classType = '';
        this.ruleForm.classType2 = '';

        this.ruleForm.comModeName = this.comMode;

        if(this.comMode == '座机外呼') {
            this.ruleForm.comMode = 1;
        }else if(this.comMode == '微信沟通') {
            this.ruleForm.comMode = 2;
        }else if(this.comMode == '手机外呼') {
            this.ruleForm.comMode = 3;
        }

        this.ruleForm.entryPerson = this.$store.state.name;
        this.ruleForm.intentionLevel = '';
        this.ruleForm.intentionLevel2 = '';
        this.ruleForm.nextContactTime = '';
        this.ruleForm.remarks = '';
        this.ruleForm.runOutPromise = '';
        this.ruleForm.runOutPromise2 = '';
        this.getGoodsList();
        this.getGoodsList2();

        this.getClueDataDetails(this.clueDataSUuid);
        if(this.$route.path.indexOf("SeatData") != -1 || this.$route.path.indexOf("peopleClues") != -1 || this.$route.path.indexOf("manageClues") != -1 || this.$route.path.indexOf("recoverData") != -1 || this.$route.path.indexOf("toallocate") != -1){
            this.routePathFlag = true;
        }

        if(this.$route.path.indexOf("registered") != -1 || this.$route.path.indexOf("completed") != -1) {
            this.releaseFlag = true;
        }

        var _self = this;
        document.onkeydown = function(e){
            if(window.event == undefined){
                var key = e.keyCode;
            }else{
                var key = window.event.keyCode;
            }
            if(key == 13){
                _self.submitForm('ruleForm');
            }
        }
        this.getClueDataNotes()
    },
    methods: {
        lookAgreementDetailsClick(row) {
            const href = '/onelogin' + xieyi + row.orderNo;
            window.open(href, '_blank');
        },
        getGoodsList() {
            this.$smoke_post(getGoodsList, {
                itemId: Number(this.examItem),
                schoolName: this.schoolId
            }).then(res => {
                if(res.code == 200) {
                    res.data.map(sll => {
                        sll['value'] = sll.name;
                    })
                    this.classTypeList = res.data;
                }
            })
        },
        phoneCopy() {
            this.$emit("phoneCopy", this.scopeRow)
        },
        phoneOut() {
            this.$emit("phoneOut", this.scopeRow)
        },
        seatOut() {
            this.$emit("seatOut", this.scopeRow)
        },
        release() {
            this.$emit("release", this.scopeRow)
        },
        quxiao() {
            this.$emit("changeDrawer", false)
            // this.$emit('fatherDataList');
        },
        handleCloseDrawer(done) {
            if(this.ruleForm.callLogUuid) {
                this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                    // this.$emit('fatherDataList');
                })
                .catch(_ => {});
            }else {
                done();
                // this.$emit('fatherDataList');
            }
        },
        handleCloseDrawerDetails(done) {
            this.notesForm.currentPage = 1;
            this.notesCallForm.currentPage = 1;
            this.pageshow = false;//让分页隐藏
            this.$nextTick(() => {//重新渲染分页
                this.pageshow = true;
            });
            done();
        },
        enumByEnumNums(arr) {
            this.$smoke_post(enumByEnumNums, {
                numberList: arr
            }).then(res => {
                if(res.code == 200){
                    this.enumList = res.data;
                }
            })
        },
        handleTabClick(tab) {
            if(tab.label == '跟进记录'){
                this.getClueDataNotes();
                this.notesForm.currentPage = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(() => {//重新渲染分页
                    this.pageshow = true;
                });
            }else if(tab.label == '通话记录'){
                this.getClueCallLog();
                this.notesCallForm.currentPage = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(() => {//重新渲染分页
                    this.pageshow = true;
                });
            }else if(tab.label == '订单记录'){
                if(this.getOrderForm.userId === '') {
                    return
                }
                this.geOrderRecord();
                this.notesCallForm.currentPage = 1;
                this.pageshow = false;//让分页隐藏
                this.$nextTick(() => {//重新渲染分页
                    this.pageshow = true;
                });
            }
        },
        getClueDataNotes() {
            this.$smoke_post(getClueDataNotes, this.notesForm).then(res => {
                if(res.code == 200) {
                    res.data.list.map(sll => {
                        sll.createTime = timestampToTime(Number(sll.createTime));
                        sll.nextContactTime = timestampToTime(Number(sll.nextContactTime));
                        // sll.classType = classTypeText(Number(sll.classType));
                    })
                    this.notesList = res.data.list;
                    // 备注记录 remarkNotesList
                    this.remarkNotesList = this.notesList.filter((val) => {
                        return !(val.remarks === '')
                    })

                    this.notesForm.total = res.data.total;
                }
            })
        },
        cityChange() {
            this.ruleForm.province = this.ruleForm.provinceCity[0];
            this.ruleForm.city = this.ruleForm.provinceCity[1];
        },
        pickerTimeChange(value) {
            this.ruleForm.nextContactTime = value.getTime();
        },
        handleCurrentChange(index) {
            this.notesForm.currentPage = index;
            this.getClueDataNotes();
        },
        handleSizeChange(index) {
            this.notesForm.pageSize = index;
            this.getClueDataNotes();
        },
        handleCurrentChangeCall(index) {
            this.notesCallForm.currentPage = index;
            this.getClueCallLog();
        },
        handleSizeChangeCall(index) {
            this.notesCallForm.pageSize = index;
            this.getClueCallLog();
        },
        submitForm(formName) {
            if(this.isDisable) {
                this.isDisable = false;
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    this.addClueDataNotes();
                  } else {
                    this.isDisable = true;
                    return false;
                  }
                });
            }
        },
        addClueDataNotes() {
            this.$smoke_post(addClueDataNotes, {
                callLogUuid: this.ruleForm.callLogUuid,
                clueDataSUuid: this.ruleForm.clueDataSUuid,
                customerForm: {
                    age: this.ruleForm.age,
                    city: this.ruleForm.city,
                    evidencePurpose: this.ruleForm.evidencePurpose,
                    gender: this.ruleForm.gender,
                    name: this.ruleForm.name,
                    province: this.ruleForm.province,
                    twoTel: this.ruleForm.twoTel,
                    work: this.ruleForm.work,
                    workingLife: this.ruleForm.workingLife,
                    wx: this.ruleForm.wx,
                    education: this.ruleForm.education,
                },
                notes: {
                    classOffer: this.ruleForm.classOffer,
                    classOffer2: this.ruleForm.classOffer2,
                    classType: this.ruleForm.classType,
                    classType2: this.ruleForm.classType2,
                    comMode: this.ruleForm.comMode,
                    entryPerson: this.ruleForm.entryPerson,
                    intentionLevel: this.ruleForm.intentionLevel,
                    intentionLevel2: this.ruleForm.intentionLevel2,
                    nextContactTime: this.ruleForm.nextContactTime,
                    remarks: this.ruleForm.remarks,
                    runOutPromise: this.ruleForm.runOutPromise,
                    runOutPromise2: this.ruleForm.runOutPromise2,
                },
                operateType: 1,
                school: this.schoolId,
                uuid: this.userCDARUuid
            }).then(res => {
                if(res.code == 200) {
                    this.$message({
                        type: 'success',
                        message: '添加备注成功',
                    })
                    this.$emit("changeDrawer", false)
                    // this.tabs_active = 'second';
                    // this.getClueDataNotes();
                    document.onkeydown = undefined;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg,
                    })
                }
            })
        },
        getClueCallLog() {
            this.$smoke_post(getClueCallLog, this.notesCallForm).then(res => {
                this.columnFlag = false;
                if(res.code == 200) {
                    res.data.list.map(sll => {
                        sll.createTime = timestampToTime(Number(sll.createTime));
                        if(sll.isCalledPhone == null) {
                            sll.isCalledPhone = '';
                        }else if(sll.isCalledPhone == 1) {
                            sll.isCalledPhone = '接通';
                        }else{
                            sll.isCalledPhone = '未接通';
                        }
                        if(sll.callStyle == 3) {
                            sll.callStyle = '外呼电话';
                        }else if(sll.callStyle == 4) {
                            sll.callStyle = '直线呼入';
                        }
                        if(sll.recordUrl){
                            this.columnWidth = 400;
                            this.columnFlag = true;
                        }
                    })
                    this.notesCallList = res.data.list;
                    this.notesCallForm.total = res.data.total;
                }
            })
        },
        // 订单记录
        geOrderRecord(){
            this.$smoke_post(getOrderList, this.getOrderForm).then(res => {
                this.pictLoading = true
                if(res.code == 200){
                    res.data.map(sll => {
                        sll.userInfo = sll.userName + ' / '  + sll.phone + ' / ' +  sll.location + sll.address ;
                    })
                    this.orderList = res.data;
                    this.pictLoading = false
                }
            })
        },
        getClueDataNotesDetails(id) {
            this.$smoke_post(getClueDataNotesDetails, {
                uuid: id
            }).then(res => {
                if(res.code == 200) {
                    this.notesDetailsForm.form.age = res.data.form.age;
                    this.notesDetailsForm.form.ageOld = res.data.form.ageOld;
                    this.notesDetailsForm.form.city = res.data.form.city;
                    this.notesDetailsForm.form.cityOld = res.data.form.cityOld;
                    this.notesDetailsForm.form.evidencePurpose = res.data.form.evidencePurpose;
                    this.notesDetailsForm.form.evidencePurposeOld = res.data.form.evidencePurposeOld;
                    this.notesDetailsForm.form.gender = res.data.form.gender;
                    this.notesDetailsForm.form.genderOld = res.data.form.genderOld;
                    this.notesDetailsForm.form.name = res.data.form.name;
                    this.notesDetailsForm.form.nameOld = res.data.form.nameOld;
                    this.notesDetailsForm.form.province = res.data.form.province;
                    this.notesDetailsForm.form.provinceOld = res.data.form.provinceOld;
                    this.notesDetailsForm.form.twoTel = res.data.form.twoTel;
                    this.notesDetailsForm.form.twoTelOld = res.data.form.twoTelOld;
                    this.notesDetailsForm.form.work = res.data.form.work;
                    this.notesDetailsForm.form.workOld = res.data.form.workOld;
                    this.notesDetailsForm.form.workingLife = res.data.form.workingLife;
                    this.notesDetailsForm.form.workingLifeOld = res.data.form.workingLifeOld;
                    this.notesDetailsForm.form.wx = res.data.form.wx;
                    this.notesDetailsForm.form.wxOld = res.data.form.wxOld;

                    this.notesDetailsForm.notCustomerForm.belongingSeat = res.data.notCustomerForm.belongingSeat;
                    this.notesDetailsForm.notCustomerForm.createTime = timestampToTime(Number(res.data.notCustomerForm.createTime));
                    this.notesDetailsForm.notCustomerForm.number = res.data.notCustomerForm.number;
                    this.notesDetailsForm.notCustomerForm.tel = res.data.notCustomerForm.tel;

                    this.notesDetailsForm.notes.classOffer = res.data.notes.classOffer;

                    if(this.classTypeList) {
                        this.classTypeList.map(sll => {
                            if(res.data.notes.classType = sll.number) {
                                this.notesDetailsForm.notes.classType = sll.name;
                            }
                        })
                    }

                    this.notesDetailsForm.notes.comMode = smoke_MJ_4(res.data.notes.comMode);
                    this.notesDetailsForm.notes.entryPerson = res.data.notes.entryPerson;
                    this.notesDetailsForm.notes.intentionLevel = smoke_MJ_5(res.data.notes.intentionLevel);
                    this.notesDetailsForm.notes.nextContactTime = timestampToTime(Number(res.data.notes.nextContactTime));
                    this.notesDetailsForm.notes.remarks = res.data.notes.remarks;
                    this.notesDetailsForm.notes.runOutPromise = res.data.notes.runOutPromise;
                }
            })
        },
        notesDetails(row) {
            this.drawerDetails = true;
            this.getClueDataNotesDetails(row.uuid);
        },
        getClueDataDetails(id) {
            this.$smoke_post(getClueDataDetails, {
                uuid: id
            }).then(res => {
                if(res.code == 200){
                    this.ruleForm.age = res.data.age == 0 ? '' : res.data.age;
                    this.ruleForm.city = res.data.city;
                    this.ruleForm.tel = res.data.tel;
                    this.ruleForm.number = res.data.number;
                    this.ruleForm.evidencePurpose = res.data.evidencePurpose == 0 ? '' : String(res.data.evidencePurpose);
                    this.ruleForm.gender = res.data.gender == 2 ? '' : res.data.gender;
                    this.ruleForm.name = res.data.name;
                    this.ruleForm.education = res.data.education == 0 || res.data.education == null ? '' : String(res.data.education);
                    this.ruleForm.province = res.data.province;
                    this.ruleForm.provinceCity = (res.data.province == "" && res.data.city == "") ? [] : [res.data.province, res.data.city];
                    this.ruleForm.twoTel = res.data.twoTel;
                    this.ruleForm.work = res.data.work;
                    this.ruleForm.workingLife = res.data.workingLife == 0 ? '' : String(res.data.workingLife);
                    this.ruleForm.wx = res.data.wx;
                    this.ruleForm.school = res.data.school;
                    this.ruleForm.callLastTime = timestampToTime(Number(res.data.callLastTime));
                    this.ruleForm.createTime = timestampToTime(Number(res.data.createTime));
                    // 跟进信息
                    let clueData = res.data.clueNotesLatest;
                    this.ruleForm.classTypeText = clueData.classTypeName
                    this.ruleForm.classType2Text = clueData.classType2Name

                    this.ruleForm.classType = clueData.classType
                    this.ruleForm.classType2 = clueData.classType2

                    this.ruleForm.classOffer = clueData.classOffer;
                    this.ruleForm.intentionLevel = clueData.intentionLevel;
                    this.ruleForm.runOutPromise = clueData.runOutPromise;
                    this.ruleForm.classOffer2 = clueData.classOffer2;
                    this.ruleForm.intentionLevel2 = clueData.intentionLevel2;
                    this.ruleForm.runOutPromise2 = clueData.runOutPromise2;
                    this.ruleForm.remarks = clueData.remarks;

                    if(clueData.comMode == '1') {
                        this.ruleForm.comModeName = '座机外呼';
                    }else if(clueData.comMode == '2') {
                        this.ruleForm.comModeName = '微信沟通';
                    }else if(clueData.comMode == '3') {
                        this.ruleForm.comModeName = '手机外呼';
                    }
                }
            })
        },
        getGoodsList2() {
            let arr;
            this.$smoke_post(getGoodsList, {
                itemId: 0,
                schoolName: this.schoolId
            }).then(res => {
                if(res.code == 200) {
                    arr = JSON.parse(JSON.stringify(res.data).replace(/name/g,"value"));
                    this.restaurants = arr;
                    this.restaurants = quchong(this.restaurants, 'value');
                }
            })
        },
        querySearch(queryString, cb) {
            var restaurants = this.restaurants;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        querySearchMain(queryString, cb) {
            var restaurants = this.classTypeList;
            var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (restaurant) => {
              return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        handleSelect(item) {
            this.ruleForm.classType2 = item.id;
            this.ruleForm.classType2Text = item.value;
        },
        handleSelectMain(item) {
            this.ruleForm.classType = item.id;
            this.ruleForm.classTypeText = item.value;
        },
        autocompleteClear() {
            this.$nextTick(() => {
                this.$refs.autocomplete.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.ruleForm.classType2 = '';
                this.$refs.autocomplete.focus();
            })
        },
        autocompleteClearMain() {
            this.$nextTick(() => {
                this.$refs.autocompleteMain.$children
                    .find(c => c.$el.className.includes('el-input'))
                    .blur();
                this.ruleForm.classType = '';
                this.$refs.autocompleteMain.focus();
            })
        },
    },
    computed: {
        drawer_:{
            get(){
                return this.drawer
            },
            set(val){
                this.$emit("changeDrawer",val)
            }
        }
    },
}
</script>
<style lang="less">
.el-autocomplete-suggestion{
    width: auto !important;
}
</style>
<style lang="less" scoped>
.el-pagination{
    text-align: right;
    margin-top: .4rem;
    margin-right: .4rem;
}
/deep/ .el-autocomplete{
    width: 200px;
}
.remark-list {
    float: right;
    color: #409EFF;
    cursor: pointer;
}
</style>
