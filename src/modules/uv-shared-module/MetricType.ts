import {StringValue} from "./StringValue";

export class MetricType extends StringValue {
    public static WATCH = new MetricType("watch");
    public static MOBILEPORTRAIT = new MetricType("mobileportrait");
    public static MOBILELANDSCAPE = new MetricType("mobilelandscape");
    public static LAPTOP = new MetricType("laptop");
    public static NONE = new MetricType("none");
}