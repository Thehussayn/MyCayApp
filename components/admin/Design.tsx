import Link from "next/link";
import dimensions from "./figma-assets.json";
export function AdminIcon({file}:{file:keyof typeof dimensions}){const [width,height]=dimensions[file];return <img src={`/figma/admin/${file}`} width={width} height={height} alt="" aria-hidden="true" className="admin-design-icon"/>}
export function AdminLogo(){return <Link href="/admin" aria-label="MyCayApp by Jeje-Ola" className="admin-logo"><span className="admin-logo-symbol"><AdminIcon file="96432.svg"/></span><span className="admin-logo-word"><AdminIcon file="90965.svg"/></span><span className="admin-logo-caption">BY JEJE-OLA</span></Link>}
export function AdminMetrics({items}:{items:[string,string|number|undefined][]}){return <dl className="admin-metrics">{items.filter(([,value])=>value!==undefined).map(([title,value])=><div key={title} className="admin-metric"><dt>{title}</dt><dd>{value}</dd></div>)}</dl>}
