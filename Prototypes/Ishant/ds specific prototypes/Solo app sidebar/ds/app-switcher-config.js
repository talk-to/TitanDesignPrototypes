/* Titan app navigation content. Components own presentation and behavior. */
(function(root){root.TitanAppSwitcherOptions=function(selected){return {
selected,triggerIcon:'app-switcher',
apps:['Mail','Calendar','Contacts','Bookings','Drive','Backup','Tasks','Site','Admin'].map(label=>({id:label.toLowerCase(),label,icon:'app-'+label.toLowerCase()})),
tools:[['Signature Designer','pink','signature-designer'],['Smart Write AI','purple','smart-write'],['Email Designer','blue','email-designer'],['Invoice Builder','green','invoice-builder']].map(([label,tone,icon])=>({id:icon,label,tone,icon})),
footer:[{id:'learn',label:'Know your Titan',icon:'know-titan',arrow:'next-arrow'},{id:'labs',label:'See more @ Titan Labs',icon:'titan-labs',arrow:'next-arrow',beaker:true}]
};};})(globalThis);
