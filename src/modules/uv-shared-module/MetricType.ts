import {StringValue} from "./StringValue";

export class MetricType extends StringValue {
    public static MOBILELANDSCAPE = new MetricType("mobilelandscape");
    public static LAPTOP = new MetricType("laptop");
}