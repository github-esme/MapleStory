var status = 0;

var minLevel = 51;
var maxLevel = 200;

var minPartySize = 3;
var maxPartySize = 6;

function start() {
	status = -1;
	action(1, 0, 0);
}

function action(mode, type, selection) {
	if (mode == -1) {
		cm.dispose();
	} else {
		if (mode == 0 && status == 0) {
			cm.dispose();
			return;
		}
		if (mode == 1)
			status++;
		else
			status--;
		if (status == 0) {
			// Lakelis has no preamble, directly checks if you're in a party
			if (cm.getParty() == null) { // No Party
				cm.sendOk("����Ҫ��ս#bԶ�ž���#k��?��ô������Ҫ��һ�������!\r\n���ȼ�Ҫ��:51��-?��.\r\n������Ҫ��:3~6��\r\n#k��������:#b���ִ�������.");
				cm.dispose();

                       } else if (cm.getChar().getVip()<0) { // Not Party Leader
				cm.sendOk("�ӳ���Ҫ��Ա�ȼ���1�ǣ������ϣ����ܽ���.");
				cm.dispose();
                      } else if (!cm.isLeader()) { // Not Party Leader
				cm.sendOk("�����Ҫ��ս#bԶ�ž����������#k�������ǵ�#b��ӳ�#k�����Ұ�!.");
				cm.dispose();
			} else {
				// Check if all party members are within PQ levels
				var party = cm.getParty().getMembers();
				var mapId = cm.getPlayer().getMapId();
				var next = true;
				var levelValid = 0;
				var inMap = 0;
				var it = party.iterator();
				while (it.hasNext()) {
					var cPlayer = it.next();
					if ((cPlayer.getLevel() >= minLevel) && (cPlayer.getLevel() <= maxLevel)) {
						levelValid += 1;

					} else {
						next = false;
					}
					if (cPlayer.getMapid() == mapId) {
						inMap += 1;
					}
				}
				if (party.size() < minPartySize || party.size() > maxPartySize || inMap < minPartySize) {
					next = false;
				}
				if (next) {
					var em = cm.warpParty(920010000);
					cm.getMap(920010000).addMapTimer(600, 920011200);
		if (em == null) {
						cm.sendOk("���ѽ��븱����ͼ.��鿴���NPC�˽⸱��");
					} else {
						if (em.getProperty("entryPossible") != "false") {
							// Begin the PQ.
							em.startInstance(cm.getParty(),cm.getPlayer().getMap());
							// Remove Passes and Coupons
							
							cm.removeAll(4001008);
							cm.removeAll(4001007);
							if(cm.partyMemberHasItem(4001008) || cm.partyMemberHasItem(4001007)) { 
								cm.getPlayer().getEventInstance().setProperty("smugglers", "true"); 
								cm.partyNotice("Your smuggling attempt has been detected. We will allow the attempt, but you will not get any NX cash from this run.");

							}
							em.setProperty("entryPossible", "false");
							cm.getPlayer().getEventInstance().setProperty("startTime", new java.util.Date().getTime());
						} else { // Check if the PQ really has people inside
							var playersInPQ = 0;
							for (var mapid = 920010000; mapid <= 920011300; mapid++) {
								playersInPQ += cm.countPlayersInMap(mapid);
							}
							if (playersInPQ <= 1)
								em.setProperty("entryPossible", "true");
							cm.sendOk("Another party has already entered the #rKerning Party Quest#k in this channel. Please try another channel, or wait for the current party to finish.");
						}
					}
					cm.dispose();
	
					
                      
			} else {
					cm.sendNext("����Ҫ��ս#bԶ�ž���#k��?��ô������Ҫ��һ�������!\r\n���ȼ�Ҫ��:51��-?��.\r\n���ӳ�Ҫ��:#r3~6��.\r\n#k��������:#b����.#k\r\n\r\n������ӱ�����#b3~6#k����Ա,���Ҷ��ڴ˵�ͼ��.\r\n�ȼ�������#b51-#b?#k��֮��!\r\nĿǰֻ��#b" + inMap + "λ��Ա#k�ڴ˵�ͼ!.");
					cm.dispose();
				}
			}
		}
	}
}