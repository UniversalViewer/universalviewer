import {StringValue} from "./StringValue";

export class MetricType extends StringValue {
    public static DESKTOP = new MetricType("desktop");
    public static MOBILELANDSCAPE = new MetricType("mobilelandscape");
    public static MOBILEPORTRAIT = new MetricType("mobileportrait");
    public static NONE = new MetricType("none");
    public static WATCH = new MetricType("watch");
}